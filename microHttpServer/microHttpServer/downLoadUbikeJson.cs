using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace microHttpServer
{
    public class downLoadUbikeJson
    {
        public static void downLoadAndUnzip()
        {
            String url = "http://data.taipei/youbike";
            String storeFile = getMyDirectory() + "\\ubike_json\\ubike.json";
            while (true)
            {
                downloadFile.downloadFileFromWeb(url, "ubike"); //下載檔案
                unzip.unzipFileOfGzip("ubike", "ubike", "ubike_json"); //解壓縮檔案
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
