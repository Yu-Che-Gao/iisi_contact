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
        public static responseObject listUbikeJson(requestObject req)
        {
            StringBuilder sb = new StringBuilder();
            String path = getMyDirectory() + "\\ubike_json";
            String content = System.IO.File.ReadAllText(path+"\\ubike.json");
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

    }

    
}
