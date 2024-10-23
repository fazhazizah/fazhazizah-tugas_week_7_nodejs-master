const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to format file size into KB/MB
const formatSize = (size) => {
  if (size >= 1000000) {
    return (size / 1000000).toFixed(2) + ' MB';
  } else if (size >= 1000) {
    return (size / 1000).toFixed(2) + ' KB';
  } else {
    return size + ' bytes';
  }
};

// Function to create a folder
const makeFolder = () => {
  rl.question('Masukan Nama Folder: ', (folderName) => {
    const folderPath = path.join(__dirname, folderName);
    if (!fs.existsSync(folderPath)) {
      fs.mkdir(folderPath, (err) => {
        if (err) throw err;
        console.log(`Folder ${folderName} berhasil dibuat!`);
        rl.close();
      });
    } else {
      console.log(`Folder ${folderName} sudah ada.`);
      rl.close();
    }
  });
};

// Function to create a file
const makeFile = () => {
  rl.question('Masukan Nama File (contoh: catatan.txt): ', (fileName) => {
    const filePath = path.join(__dirname, 'unorganize_folder', fileName);

    fs.writeFile(filePath, '', (err) => {
      if (err) throw err;
      console.log(`File ${fileName} berhasil dibuat!`);
      rl.close();
    });
  });
};

// Function to move files based on their extensions
const extSorter = () => {
  const folderPath = path.join(__dirname, 'unorganize_folder');
  fs.readdir(folderPath, (err, files) => {
    if (err) throw err;

    files.forEach((file) => {
      const ext = path.extname(file).slice(1).toLowerCase();
      const targetFolder = path.join(__dirname, ext);

      if (!fs.existsSync(targetFolder)) {
        fs.mkdirSync(targetFolder);
      }

      const oldPath = path.join(folderPath, file);
      const newPath = path.join(targetFolder, file);

      fs.rename(oldPath, newPath, (err) => {
        if (err) throw err;
        console.log(`File ${file} berhasil dipindahkan ke folder ${ext}`);
      });
    });
  });
};

// Function to read folder contents in the desired format
const readFolder = () => {
  rl.question('Masukan Nama Folder: ', (folderName) => {
    const folderPath = path.join(__dirname, folderName);
    fs.readdir(folderPath, (err, files) => {
      if (err) throw err;

      const fileDetails = files.map(file => {
        const filePath = path.join(folderPath, file);
        const stats = fs.statSync(filePath);

        // Format date to 'YYYY-MM-DD'
        const formattedDate = `${stats.birthtime.getFullYear()}-${String(stats.birthtime.getMonth() + 1).padStart(2, '0')}-${String(stats.birthtime.getDate()).padStart(2, '0')}`;

        // Determine file type based on extension
        const ext = path.extname(file).slice(1).toLowerCase();
        let jenisFile = 'lainnya';  // Default if file type is not recognized
        if (['jpg', 'png', 'jpeg'].includes(ext)) {
          jenisFile = 'gambar';
        } else if (['txt', 'md'].includes(ext)) {
          jenisFile = 'text';
        }

        return {
          namaFile: file,
          extensi: ext,
          jenisFile: jenisFile,
          tanggalDibuat: formattedDate,
          ukuranFile: formatSize(stats.size),  // File size in MB/KB
        };
      });

      console.log(`Berhasil menampilkan isi dari folder ${folderName}:`, fileDetails);
      rl.close();
    });
  });
};

// Function to read a file's content
const readFile = () => {
  rl.question('Masukan Nama File yang Ingin Dibaca: ', (fileName) => {
    const filePath = path.join(__dirname, 'txt', fileName);

    if (fs.existsSync(filePath)) {
      fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) throw err;
        console.log(`Isi file ${fileName}:\n\n${data}`);
        rl.close();
      });
    } else {
      console.error(`File ${fileName} tidak ditemukan di folder txt.`);
      rl.close();
    }
  });
};

// Export all functions to be used in index.js
module.exports = {
  makeFolder,
  makeFile,
  extSorter,
  readFolder,
  readFile,
};
