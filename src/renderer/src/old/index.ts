//txt 数据转换
async readDriversFromTxt(dirPath, files) {
  const filesContent = [];
  // Define potential subdirectories to check
  const subDirs = ['', this.sleepName, 'HXJ_SleepReport', 'SleepReport', this.driverName, 'HXJ_DPDATA'];

  for (const fileName of files) {
    let combinedData = {};
    let foundAny = false;

    for (const sub of subDirs) {
      const p = path.join(dirPath, sub, fileName);
      if (await this.fileExists(p)) {
        try {
          let content = await fs.readFile(p, 'utf-8');
          content = cleanJsonContent(content);
          const jsonData = JSON.parse(content);
          Object.assign(combinedData, jsonData);
          foundAny = true;
        } catch (e) {
          // Ignore parse errors
        }
      }
    }

    if (foundAny) {
      const keyMap = {
        srt: 'SRT',
        singlerunningtime: 'SingleRunningTime',
        al: 'AL',
        airleakage: 'AirLeakage',
        pre: 'Pre',
        pmean: 'Pmean',
        p95: 'P95',
        pmax: 'Pmax',
        ahi: 'AHI',
        ai: 'AI',
        hi: 'HI',
        vt: 'Vt',
        mv: 'MV',
        rr: 'RR'
      };
      Object.keys(combinedData).forEach(rawKey => {
        const mapped = keyMap[String(rawKey).trim().toLowerCase()];
        if (mapped && combinedData[mapped] === undefined) {
          combinedData[mapped] = combinedData[rawKey];
        }
      });
      const numericKeys = [
        'SRT',
        'SingleRunningTime',
        'AL',
        'AirLeakage',
        'Pre',
        'Pmean',
        'P95',
        'Pmax',
        'AHI',
        'AI',
        'HI',
        'Vt',
        'MV',
        'RR'
      ];
      numericKeys.forEach(key => {
        const raw = combinedData[key];
        if (raw !== undefined && raw !== null && raw !== '') {
          const num = parseFloat(raw);
          if (!Number.isNaN(num)) combinedData[key] = num;
        }
      });
      if (combinedData.SRT !== undefined && combinedData.SingleRunningTime === undefined) {
        combinedData.SingleRunningTime = combinedData.SRT;
      }
      if (combinedData.AL !== undefined && combinedData.AirLeakage === undefined) {
        combinedData.AirLeakage = combinedData.AL;
      }
      if (combinedData.Pre !== undefined && combinedData.Pmean === undefined) {
        combinedData.Pmean = combinedData.Pre;
      }
      const date = parseFileNameToDate(fileName);
      let dateStr = date ? date.toISOString().split('T')[0] : '';
      if (!dateStr && combinedData.Date) {
        const parsed = new Date(combinedData.Date);
        if (!Number.isNaN(parsed.getTime())) dateStr = parsed.toISOString().split('T')[0];
      }
      if (!dateStr && combinedData.date) {
        const parsed = new Date(combinedData.date);
        if (!Number.isNaN(parsed.getTime())) dateStr = parsed.toISOString().split('T')[0];
      }
      filesContent.push({
        Date: dateStr,
        Name: '',
        Tel: '',
        ...combinedData,
        source: 'txt'
      });
    }
  }
  return { filesContent };
}






    // 2. Detail Data
    let detailPath = await this.findFileInSubdirs(dirPath, fileName, [this.detailName]);
    if (detailPath) {
      let content = await fs.readFile(detailPath, 'utf-8');
      try {
        const parsed = JSON.parse(content);
        detailData = Object.entries(parsed).map(([ts, obj]) => ({ Time: ts, ...obj }));
      } catch (e) {
        console.warn('Detail JSON parse error');
      }
    }

    // 3. Record (RT) Data
    let recordPath = await this.findFileInSubdirs(dirPath, fileName, [this.dataName]);
    if (recordPath) {
      let content = await fs.readFile(recordPath, 'utf-8');
      try {
        const parsed = JSON.parse(content);
        recordData = Object.entries(parsed).map(([ts, obj]) => ({ timestamp: ts, ...obj }));
      } catch (e) {
        console.warn('Record JSON parse error');
      }
    }