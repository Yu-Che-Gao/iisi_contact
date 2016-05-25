using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace microHttpServer
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            Thread downloadUbikeJsonThread = new Thread(new ThreadStart(downLoadUbikeJson.downLoadAndUnzip));
            downloadUbikeJsonThread.Start();

            Thread downloadBusJsonThread = new Thread(new ThreadStart(downloadBusAndUnzip.downloadAndUnzip));
            downloadBusJsonThread.Start();

            Thread downloadBusStopJsonThread = new Thread(new ThreadStart(downloadBusStop.downloadAndUnZip));
            downloadBusStopJsonThread.Start();

            kernal myKernal = new kernal(3000,
            (req) =>
            {
                if (req.Url == "/ubike") //ubike詳細資料
                    return requestAndResponseFunction.listUbikeJson(req);
                else if (req.Url == "/food") //食尚玩家資料
                    return requestAndResponseFunction.listFood(req);
                else if (req.Url == "/view") //景點資料
                    return requestAndResponseFunction.listView(req);
                else if (req.Url == "/MRT_arrive") //台北捷運到站站名資料
                    return requestAndResponseFunction.listMRTArrive(req);
                else if (req.Url == "/MRT_xy") //台北捷運各出入口座標
                    return requestAndResponseFunction.listMRTxy(req);
                else if (req.Url == "/Bus_time") //台北公車預估到站時間
                    return requestAndResponseFunction.listBus(req);
                else if (req.Url == "/Bus_xy") //台北公車站牌位置
                    return requestAndResponseFunction.listBusStop(req);
                else
                    return new responseObject()
                    {
                        StatusText = responseObject.HttpStatus.Http500
                    };
            });
            button1.Enabled = false;
            MessageBox.Show("已開始下載資料集以及開啟3000 port");
        }

        private static String getMyDirectory() //取得本地路徑
        {
            String dir = System.Environment.CurrentDirectory;
            return dir;
        }
    }
}
