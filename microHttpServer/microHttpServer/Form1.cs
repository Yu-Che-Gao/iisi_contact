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
            kernal myKernal = new kernal(3000,
            (req) =>
            {
                if (req.Url == "/ubike")
                    return requestAndResponseFunction.listUbikeJson(req);
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
