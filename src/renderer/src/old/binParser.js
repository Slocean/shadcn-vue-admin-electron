'use strict'

const fs = require('fs').promises;
const path = require('path');

class BinParser {
    constructor() {
        this.DECRYPT_KEY = 199;
        this.FRAME_HEADER = 0xAA;
        this.FRAME_TAIL = 0x55;
    }

    /**
     * 解密单个字节 - 与Python版本保持一致
     * @param {number} cipher - 要解密的字节
     * @returns {number} 解密后的字节
     */
    decryptByte(cipher) {
        // 强制转换为unsigned char范围（0-255）
        cipher = cipher & 0xFF;
        const key = this.DECRYPT_KEY & 0xFF;
        
        // 计算term：提取最低位并左移1位
        const term = ((cipher & 0x01) << 1) & 0xFF;
        
        // 严格按照C语言公式计算，确保溢出行为一致
        const plain = (cipher + 256 - key - term) % 256;
        return plain;
    }

    /**
     * 解密整个数据缓冲区
     * @param {Buffer} data - 要解密的数据
     * @returns {Buffer} 解密后的数据
     */
    decryptData(data) {
        const decrypted = Buffer.alloc(data.length);
        for (let i = 0; i < data.length; i++) {
            decrypted[i] = this.decryptByte(data[i]);
        }
        return decrypted;
    }

    /**
     * 检查二进制文件是否有效
     * @param {string} filePath - 文件路径
     * @returns {boolean} 文件是否有效
     */
    async checkBinFile(filePath) {
        try {
            const data = await fs.readFile(filePath);
            if (data.length < 1) return false;
            
            const firstByte = this.decryptByte(data[0]);
            return firstByte === this.FRAME_HEADER;
        } catch (error) {
            console.error('Error checking bin file:', error);
            return false;
        }
    }

    /**
     * 计算CRC校验值 - 与Python版本保持一致
     * @param {Buffer} data - 要计算CRC的数据
     * @returns {number} CRC值
     */
    calculateCRC(data) {
        // Python版本: sum(data_part) & 0xFF
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
            sum += data[i];
        }
        return sum & 0xFF;
    }

    /**
     * 解析单个二进制文件
     * @param {string} filePath - 文件路径
     * @returns {Object} 解析结果
     */
    async parseSingleFile(filePath) {
        try {
            const encryptedData = await fs.readFile(filePath);
            const decryptedData = this.decryptData(encryptedData);
            
            const results = [];
            let offset = 0;
            
            while (offset < decryptedData.length) {
                // 查找帧头
                const headerIndex = decryptedData.indexOf(this.FRAME_HEADER, offset);
                if (headerIndex === -1) break;
                
                offset = headerIndex;
                
                // 检查是否有足够的数据读取帧信息
                if (offset + 4 >= decryptedData.length) break;
                
                const frameType = decryptedData[offset + 1];
                const dataLength = decryptedData.readUInt16LE(offset + 2);
                
                // 检查数据长度是否合理
                // 数据长度不能超过剩余缓冲区长度减去必要的头尾和CRC字节
                // Header(1) + Type(1) + Length(2) + Data(N) + Padding(2) + CRC(1) + Tail(1) = N + 8 bytes
                if (dataLength > decryptedData.length - offset - 8) {
                    offset++;
                    continue;
                }
                
                // 提取数据部分
                const frameData = decryptedData.slice(offset + 4, offset + 4 + dataLength);
                
                // CRC校验 - 根据Python版本的帧结构，CRC位置在数据后面跳过2个填充字节
                const crcPosition = offset + 4 + dataLength + 2;
                if (crcPosition >= decryptedData.length) {
                    offset++;
                    continue;
                }
                const expectedCRC = decryptedData[crcPosition];
                const actualCRC = this.calculateCRC(frameData);
                
                if (expectedCRC !== actualCRC) {
                    offset++;
                    continue;
                }
                
                // 帧尾校验
                const frameTailPosition = crcPosition + 1;
                if (frameTailPosition >= decryptedData.length) {
                    offset++;
                    continue;
                }
                const frameTail = decryptedData[frameTailPosition];
                if (frameTail !== this.FRAME_TAIL) {
                    offset++;
                    continue;
                }
                
                // 根据帧类型解析数据
                let parsedData;
                switch (frameType) {
                    case 0x00: // Detail data (DT.bin)
                        parsedData = this.parseDetailData(frameData);
                        break;
                    case 0x01: // RT data (RT.bin)
                        parsedData = this.parseRTData(frameData);
                        break;
                    case 0x02: // DP data (DP.bin)
                        parsedData = this.parseDPData(frameData);
                        break;
                    case 0x03: // Sleep report (SP.bin)
                        parsedData = this.parseSleepReport(frameData);
                        break;
                    default:
                        parsedData = { type: 'unknown', data: frameData.toString('hex') };
                }
                
                results.push({
                    frameType,
                    dataLength,
                    data: parsedData,
                    offset: headerIndex
                });
                
                offset = frameTailPosition + 1; // 移动到下一帧
            }
            
            return {
                fileName: path.basename(filePath),
                filePath,
                totalFrames: results.length,
                frames: results,
                // 添加兼容性字段
                driver: this.extractDriverData(results),
                record: this.extractRecordData(results)
            };
            
        } catch (error) {
            console.error('Error parsing bin file:', error);
            throw error;
        }
    }

    /**
     * 通用字段解析辅助方法
     * @param {Buffer} data 数据缓冲区
     * @param {Object} fieldRanges 字段定义 { key: [start, end, type] }
     * @returns {Object} 解析出的对象
     */
    parseFields(data, fieldRanges) {
        const report = {};
        for (const [field, [start, end, type]] of Object.entries(fieldRanges)) {
            if (end > data.length) {
                report[field] = "数据不足";
                continue;
            }

            let value;
            try {
                switch (type) {
                    case 'uint32': value = data.readUInt32LE(start); break;
                    case 'int32': value = data.readInt32LE(start); break;
                    case 'float': value = data.readFloatLE(start); break;
                    case 'string': 
                        value = data.subarray(start, end).toString('ascii').replace(/\0/g, ''); 
                        break;
                    default: value = null;
                }

                // 特殊字段处理
                if (field === 'Time') {
                    report[field] = value;
                    try {
                        report['FormattedTime'] = new Date(value * 1000).toLocaleString('zh-CN');
                    } catch (e) {
                        report['FormattedTime'] = String(value);
                    }
                } else if (type === 'float') {
                     // 保留1位小数
                    report[field] = Math.round(value * 10) / 10;
                } else {
                    report[field] = (value === null || value === undefined) ? "N/A" : value;
                }
            } catch (e) {
                console.warn(`Error parsing field ${field}:`, e);
                report[field] = "Error";
            }
        }
        return report;
    }

    /**
     * 解析Detail数据
     * @param {Buffer} data - 数据缓冲区
     * @returns {Object} 解析结果
     */
    parseDetailData(data) {
        try {
            if (data.length < 100) {
                throw new Error(`DETAIL帧数据长度不足100字节（实际:${data.length}）`);
            }

            const fieldRanges = {
                'Time': [0, 4, 'uint32'],
                'UT': [4, 8, 'float'],
                'P': [8, 12, 'float'],
                'L': [12, 16, 'float'],
                'Pre_L': [16, 20, 'float'],
                'AHI': [20, 24, 'uint32'],
                'AI': [24, 28, 'uint32'],
                'CAI': [28, 32, 'uint32'],
                'MAX_flow': [32, 36, 'uint32'],
                'Vt': [36, 40, 'uint32'],
                'Pre_Vt': [40, 44, 'uint32'],
                'A_T': [44, 48, 'uint32'],
                'L_T': [48, 52, 'uint32'],
                'Bre': [52, 56, 'uint32'],
                'FL': [56, 60, 'uint32'],
                'DEVI': [60, 64, 'float'],
                'F_C': [64, 68, 'uint32'],
                'B_C': [68, 72, 'uint32'],
                'F_A': [72, 76, 'float'],
                'Q100_A': [76, 80, 'float'],
                'Q50_A': [80, 84, 'float'],
                'Q30_A': [84, 88, 'float'],
                'SC': [88, 92, 'uint32'],
                'MIN_D': [92, 96, 'float'],
                'WC': [96, 100, 'uint32']
            };

            return {
                type: 'detail',
                length: data.length,
                ...this.parseFields(data, fieldRanges)
            };
        } catch (error) {
            return { type: 'detail', error: error.message };
        }
    }

    /**
     * 解析RT数据
     * @param {Buffer} data - 数据缓冲区
     * @returns {Object} 解析结果
     */
    parseRTData(data) {
        try {
            if (data.length < 80) {
                throw new Error(`RTDATA帧数据长度不足80字节（实际:${data.length}）`);
            }

            const fieldRanges = {
                'Time': [0, 4, 'uint32'],
                'UseTime': [4, 8, 'float'],
                'PAvg': [8, 12, 'float'],
                'P95': [12, 16, 'float'],
                'Pmax': [16, 20, 'float'],
                'AHI': [20, 24, 'float'],
                'AI': [24, 28, 'float'],
                'HI': [28, 32, 'float'],
                'CAI': [32, 36, 'float'],
                'AirLeakage': [36, 40, 'float'],
                'MV': [40, 44, 'float'],
                'Vt': [44, 48, 'float'],
                'RR': [48, 52, 'float'],
                'Ti': [52, 56, 'float'],
                'IE': [56, 60, 'float'],
                'DevicePauseFlag': [60, 64, 'uint32'],
                'Error': [64, 68, 'uint32'],
                'SpontTrigger': [68, 72, 'float'],
                'SpO2': [72, 76, 'float'],
                'CSR': [76, 80, 'float']
            };

            return {
                type: 'rtdata',
                length: data.length,
                ...this.parseFields(data, fieldRanges)
            };
        } catch (error) {
            return { type: 'rtdata', error: error.message };
        }
    }

    /**
     * 解析DP数据
     * @param {Buffer} data - 数据缓冲区
     * @returns {Object} 解析结果
     */
    parseDPData(data) {
        try {
            if (data.length < 120) {
                throw new Error(`DPDATA数据部分长度不足（实际:${data.length}, 期望:120）`);
            }

            const fieldRanges = {
                'Time': [0, 4, 'int32'],
                'SIM': [4, 28, 'string'],
                'IMEI': [28, 44, 'string'],
                'Modle': [44, 56, 'string'],
                'MaskType': [56, 60, 'float'],
                'HumiCtrGear': [60, 64, 'float'],
                'PipeTemp': [64, 68, 'float'],
                'PipeType': [68, 72, 'float'],
                'AutoStart': [72, 76, 'float'],
                'RunningMode': [76, 84, 'string'],
                'InitialPressure': [84, 88, 'float'],
                'ExpiratePressure': [88, 92, 'float'],
                'InhalePressure': [92, 96, 'float'],
                'RiseRate': [96, 100, 'float'],
                'InhaleSensibility': [100, 104, 'float'],
                'ExpirateSensibility': [104, 108, 'float'],
                'DelayRisePressure': [108, 112, 'float'],
                'MinInhaleTime': [112, 116, 'float'],
                'MaxInhaleTime': [116, 120, 'float'],
                'SetBreathRate': [120, 124, 'float'],
                'EPRLevel': [124, 128, 'float']
            };

            return {
                type: 'dpdata',
                length: data.length,
                ...this.parseFields(data, fieldRanges)
            };
        } catch (error) {
            return { type: 'dpdata', error: error.message };
        }
    }

    /**
     * 解析睡眠报告数据
     * @param {Buffer} data - 数据缓冲区
     * @returns {Object} 解析结果
     */
    parseSleepReport(data) {
        try {
            if (data.length < 56) {
                throw new Error("数据长度不足56字节");
            }

            const report = {};
            // 根据Python版本的字段定义
            const fieldRanges = {
                'SingleRunningTime': [0, 4],
                'AirLeakage': [4, 8],
                'Pmean': [8, 12],
                'P95': [12, 16],
                'Pmax': [16, 20],
                'Vt': [20, 24],
                'RR': [24, 28],
                'MV': [28, 32],
                'Ti': [32, 36],
                'IE': [36, 40],
                'Cycle': [40, 44],
                'AHI': [44, 48],
                'HI': [48, 52],
                'CAI': [52, 56]
            };

            for (const [field, [start, end]] of Object.entries(fieldRanges)) {
                if (end <= data.length) {
                    if (field === 'CAI') {
                        const value = data.readUInt32LE(start);
                        // report[`${field}_value`] = value; // 移除 _value 字段
                        report[field] = value.toString();
                    } else {
                        const value = data.readUInt32LE(start) / 10;
                        // report[`${field}_value`] = value; // 移除 _value 字段
                        
                        if (field === 'SingleRunningTime') {
                            report[field] = value.toFixed(1);
                        } else if (field === 'AirLeakage') {
                            report[field] = value.toFixed(1);
                        } else if (['Pmean', 'P95', 'Pmax'].includes(field)) {
                            report[field] = value.toFixed(1);
                        } else if (field === 'Vt') {
                            report[field] = value.toFixed(1);
                        } else if (field === 'RR') {
                            report[field] = value.toFixed(1);
                        } else if (field === 'MV') {
                            report[field] = value.toFixed(1);
                        } else if (field === 'Ti') {
                            report[field] = value.toFixed(1);
                        } else if (field === 'IE') {
                            report[field] = `1:${value.toFixed(1)}`;
                        } else if (field === 'Cycle') {
                            report[field] = value.toFixed(1);
                        } else if (['AHI', 'HI'].includes(field)) {
                            report[field] = value.toFixed(1);
                        }
                    }
                } else {
                    report[field] = "数据不足";
                    // report[`${field}_value`] = null; // 移除 _value 字段
                }
            }

            return {
                type: 'sleep_report',
                length: data.length,
                ...report
            };
        } catch (error) {
            return { type: 'sleep_report', error: error.message };
        }
    }

    /**
     * 批量解析文件夹中的二进制文件
     * @param {string} folderPath - 文件夹路径
     * @returns {Array} 解析结果数组
     */
    async parseFolder(folderPath) {
        try {
            const files = await fs.readdir(folderPath);
            const binFiles = files.filter(file => file.endsWith('.bin'));
            
            const results = [];
            for (const file of binFiles) {
                const filePath = path.join(folderPath, file);
                try {
                    const result = await this.parseSingleFile(filePath);
                    results.push(result);
                } catch (error) {
                    console.error(`Error parsing ${file}:`, error);
                    results.push({
                        fileName: file,
                        filePath,
                        error: error.message
                    });
                }
            }
            
            return results;
        } catch (error) {
            console.error('Error parsing folder:', error);
            throw error;
        }
    }

    /**
     * 从解析结果中提取驱动数据
     */
    extractDriverData(frames) {
        const driverData = {};
        frames.forEach(frame => {
            if (frame.frameType === 0x02 && frame.data) { // DP data
                Object.assign(driverData, frame.data);
            }
        });
        return driverData;
    }

    /**
     * 从解析结果中提取记录数据
     */
    extractRecordData(frames) {
        const recordData = {};
        const detailFrames = [];
        
        frames.forEach(frame => {
            if (frame.frameType === 0x00 && frame.data) { // Detail data (DT.bin)
                // 收集所有详细数据帧
                detailFrames.push(frame.data);
                // 合并到recordData中
                Object.assign(recordData, frame.data);
            }
        });
        
        // 如果有详细数据帧，添加到recordData中
        if (detailFrames.length > 0) {
            recordData.detailFrames = detailFrames;
            recordData.frameCount = detailFrames.length;
        }
        
        return recordData;
    }
}

module.exports = BinParser;