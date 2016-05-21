using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace microHttpServer
{
    public class requestObject
    {
        public string Method, Url, Protocol;
        public Dictionary<string, string> Headers;
        public requestObject(StreamReader sr)
        {
            string firstLine = sr.ReadLine();
            string[] p = firstLine.Split(' ');
            Method = p[0];
            Url = (p.Length > 1) ? p[1] : "NA";
            Protocol = (p.Length > 2) ? p[2] : "NA";
            string line = null;
            Headers = new Dictionary<string, string>();
            while (!string.IsNullOrEmpty(line = sr.ReadLine()))
            {
                int pos = line.IndexOf(":");
                if (pos > -1)
                    Headers.Add(line.Substring(0, pos),
                        line.Substring(pos + 1));
            }
        }
    }
}
