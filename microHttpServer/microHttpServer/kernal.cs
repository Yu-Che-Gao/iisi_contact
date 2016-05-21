using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace microHttpServer
{
    class kernal
    {
        private Thread serverThread;
        TcpListener listener;
        public kernal(int port, Func<requestObject, responseObject> reqProc)
        {
            //IPAddress ipAddr = IPAddress.Parse("192.168.1.100");
            IPAddress ipAddr = IPAddress.Parse("127.0.0.1");
            listener = new TcpListener(ipAddr, port);
            //另建Thread執行
            serverThread = new Thread(() =>
            {
                listener.Start();
                while (true)
                {
                    try
                    {
                        Socket s = listener.AcceptSocket();
                        NetworkStream ns = new NetworkStream(s);
                        StreamReader sr = new StreamReader(ns);
                        requestObject req = new requestObject(sr);
                        responseObject resp = reqProc(req);
                        StreamWriter sw = new StreamWriter(ns);
                        sw.WriteLine("HTTP/1.1 {0}", resp.StatusText);
                        sw.WriteLine("Content-Type: " + resp.ContentType);
                        foreach (string k in resp.Headers.Keys)
                            sw.WriteLine("{0}: {1}", k, resp.Headers[k]);
                        sw.WriteLine("Content-Length: {0}", resp.Data.Length);
                        sw.WriteLine();
                        sw.Flush();
                        s.Send(resp.Data);
                        s.Shutdown(SocketShutdown.Both);
                        ns.Close();
                    }
                    catch(Exception ex)
                    {

                    }
                    
                }
            });
            serverThread.Start();
        }
        public void Stop()
        {
            listener.Stop();
            serverThread.Abort();
        }
    }
}
