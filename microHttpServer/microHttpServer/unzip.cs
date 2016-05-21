using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace microHttpServer
{
    public class unzip
    {
        /**
         * unzip.unzipFileOfGzip(原始檔名, 目標檔名, 解壓縮後放的位置)
         * 描述: 將檔案解壓縮到unzip資料夾下
         */
        public static void unzipFileOfGzip(String rawFileName, String finalFileName, String dir)
        {
            String raw = downloadFile.getDownloadFileName(rawFileName);
            String final = getMyDirectory() + "\\" + dir + "\\" + finalFileName + ".json";
            createDir(dir); //創建資料夾
            unGZipFile(raw, final); //開始解壓縮
        }

        private static void unGZipFile(string asZipFileName, string asUnZipFileName)
        {
            FileStream fsStream = new FileStream(asZipFileName, FileMode.Open, FileAccess.Read);
            //解壓縮
            GZipStream gzStream = new GZipStream(fsStream, CompressionMode.Decompress);
            StreamReader srReader = new StreamReader(gzStream);
            string sData = srReader.ReadToEnd();
            srReader.Close();
            writeFile(asUnZipFileName, sData);
        }

        private static void writeFile(string asFileName, string asData)
        {
            FileStream fsStream = new FileStream(asFileName, FileMode.OpenOrCreate, FileAccess.Write);
            StreamWriter swWriter = new StreamWriter(fsStream);
            swWriter.Write(asData);
            swWriter.Close();
        }

        private static String getMyDirectory() //取得本地路徑
        {
            String dir = System.Environment.CurrentDirectory;
            return dir;
        }

        private static void createDir(String dirName) //創建資料夾
        {
            String dirPath = getMyDirectory() + "\\" + dirName;
            if (!Directory.Exists(dirPath))
            {
                Directory.CreateDirectory(dirPath);
            }
        }
    }
}
