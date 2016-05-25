using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace microHttpServer
{
    class downloadBusStop
    {
        public static void downloadAndUnZip()
        {
            String url = "http://data.taipei/bus/StopLocation";
            String stroreFile = getMyDirectory() + "\\bus_stop_json\\bus_stop.json";
            while (true)
            {
                downloadFile.downloadFileFromWeb(url, "bus_stop");
                unzip.unzipFileOfGzip("bus_stop", "bus_stop", "bus_stop_json");
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
