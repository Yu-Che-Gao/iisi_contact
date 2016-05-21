using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace microHttpServer
{
    public class responseObject
    {
        public class HttpStatus
        {
            public static string Http200 = "200 OK";
            public static string Http404 = "404 Not Found";
            public static string Http500 = "500 Error";
        }
        public string StatusText = HttpStatus.Http200;
        public string ContentType = "text/plain";
        public Dictionary<string, string> Headers = new Dictionary<string, string>();
        public byte[] Data = new byte[] { };
    }
}
