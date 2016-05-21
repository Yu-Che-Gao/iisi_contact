using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace 串接youbike_api
{
    public class downloadFile
    {
        /**
         * 下載檔案函式:downloadFileFromWeb
         * downloadFile.downloadFileFromWeb(下載網址, 儲存不含附檔名的檔案名)
         * 範例程式碼: downloadFile.downloadFileFromWeb(url.Text, fileNameText.Text);
         */
        public static void downloadFileFromWeb(String url, String fileName)
        {
            WebClient webClient = new WebClient();
            webClient.DownloadFile(url, getDownloadFileName(fileName));
        }

        public static String getDownloadFileName(String fileName)
        {
            return getMyDirectory() + "\\" + fileName + ".gz";
        }

        private static String getMyDirectory() //取得本地路徑
        {
            String dir = System.Environment.CurrentDirectory;
            return dir;
        }
    }
}
