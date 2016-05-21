using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace microHttpServer
{
    public class requestAndResponseFunction
    {
        public static responseObject listUbikeJson(requestObject req) //列出UBike資料
        {
            StringBuilder sb = new StringBuilder();
            String path = getMyDirectory() + "\\ubike_json";
            String content = System.IO.File.ReadAllText(path + "\\ubike.json");
            sb.Append(content);
            return new responseObject()
            {
                Data = Encoding.UTF8.GetBytes(sb.ToString())
            };
        }

        public static responseObject listFood(requestObject req) //列出食尚玩家資料
        {
            StringBuilder sb = new StringBuilder();
            String path = getMyDirectory() + "\\food_json";
            String content = System.IO.File.ReadAllText(path + "\\food.json");
            sb.Append(content);
            return new responseObject()
            {
                Data = Encoding.UTF8.GetBytes(sb.ToString())
            };
        }

        public static responseObject listView(requestObject req) //列出景點資料
        {
            StringBuilder sb = new StringBuilder();
            String content = getView();
            sb.Append(content);
            return new responseObject()
            {
                Data = Encoding.UTF8.GetBytes(sb.ToString())
            };
        }

        public static responseObject listMRTArrive(requestObject req) //列出捷運列車到站站名資料
        {
            StringBuilder sb = new StringBuilder();
            String content = getView();
            sb.Append(content);
            return new responseObject()
            {
                Data = Encoding.UTF8.GetBytes(sb.ToString())
            };
        }

        public static responseObject listMRTxy(requestObject req) //列出所有捷運車站的出入口座標
        {
            StringBuilder sb = new StringBuilder();
            String content = getMRTCoordinates();
            sb.Append(content);
            return new responseObject()
            {
                Data = Encoding.UTF8.GetBytes(sb.ToString())
            };
        }

        private static String getMyDirectory() //取得本地路徑
        {
            String dir = System.Environment.CurrentDirectory;
            return dir;
        }

        private static String getView() //取得景點資料
        {
            String allView = file_get_contents("http://data.taipei/opendata/datalist/apiAccess?scope=resourceAquire&rid=36847f3f-deff-4183-a5bb-800737591de5");
            return allView;
        }

        private static String getMRTArrive() //取得捷運列車到站站名資料
        {
            String allMRTArrive = file_get_contents("http://data.taipei/opendata/datalist/apiAccess?scope=resourceAquire&rid=55ec6d6e-dc5c-4268-a725-d04cc262172b");
            return allMRTArrive;
        }

        private static String getMRTCoordinates() //取得捷運站出入口座標
        {
            String path = getMyDirectory() + "\\mrt_xy";
            String allMRTCoordinates = System.IO.File.ReadAllText(path + "\\mrt_xy.json");
            return allMRTCoordinates;
        }

        private static string file_get_contents(string fileName) //發送get取得網頁內容
        {
            string sContents = string.Empty;
            if (fileName.ToLower().IndexOf("http:") > -1)
            {
                System.Net.WebClient wc = new System.Net.WebClient();
                byte[] response = wc.DownloadData(fileName);
                sContents = System.Text.Encoding.UTF8.GetString(response);
            }
            else
            {
                System.IO.StreamReader sr = new System.IO.StreamReader(fileName);
                sContents = sr.ReadToEnd();
                sr.Close();
            }
            return sContents;
        }
    }


}
