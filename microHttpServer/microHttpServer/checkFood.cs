using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace microHttpServer
{
    class checkFood
    {
        //TODO: 確認食物
        public static void checkDirectory()
        {
            String storeFile = "\\food_json\\food.json";
            while (true)
            {

                Thread.Sleep(5000);
            }
        }

        private static void createDir(String dirName) //創建資料夾
        {
            String dirPath = getMyDirectory() + "\\" + dirName;
            if (!Directory.Exists(dirPath))
            {
                Directory.CreateDirectory(dirPath);
            }
        }

        private static String getMyDirectory() //取得本地路徑
        {
            String dir = System.Environment.CurrentDirectory;
            return dir;
        }
    }
}
