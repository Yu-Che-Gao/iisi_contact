using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace microHttpServer
{
    class downloadBusAndUnzip
    {
        public static void downloadAndUnzip()
        {
            String url = "http://data.taipei/bus/EstiamteTime";
            String storeFile = getMyDirectory() + "\\bus_time_json\\bus_time.json";
            while (true)
            {
                downloadFile.downloadFileFromWeb(url, "bus_time"); //下載檔案
                unzip.unzipFileOfGzip("bus_time", "bus_time", "bus_json"); //解壓縮檔案
                Thread.Sleep(5000);
            }
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
