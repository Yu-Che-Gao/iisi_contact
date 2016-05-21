using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace 串接youbike_api
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            url.Text = "http://data.taipei/youbike";
        }

        private void button1_Click(object sender, EventArgs e)
        {
            downloadFile.downloadFileFromWeb(url.Text, fileNameText.Text); //下載檔案
            unzip.unzipFileOfGzip(fileNameText.Text,fileNameText.Text); //解壓縮檔案
            MessageBox.Show("解壓縮完成");
        }
    }
}
