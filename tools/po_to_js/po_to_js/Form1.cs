using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace po_to_js
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            MessageBox.Show("Select Russian po file");
            if (openFileDialog1.ShowDialog() != DialogResult.OK)
            {
                return;
            }
            var filename_ru = openFileDialog1.FileName;

            var lines = File.ReadAllLines(filename_ru);
            Dictionary<string, string> res_dict = new Dictionary<string, string>();
            string cur_msg_id = null;
            bool is_poing_namestxt = false;
            foreach (var line in lines)
            {
                if (line.Contains(@"data/mp/messages/strings/names.txt"))
                {
                    is_poing_namestxt = true;
                }
                if (line.Contains("msgid"))
                {
                    cur_msg_id = line.Replace("msgid ", "").Replace("\"","");
                }
                if (line.Contains("msgstr") && cur_msg_id != null && is_poing_namestxt)
                {
                    var msg_str = line.Replace("msgstr ", "").Replace("\"", "");
                    if (!res_dict.ContainsKey(cur_msg_id))
                    {
                        res_dict.Add(cur_msg_id, msg_str);
                    }
                    cur_msg_id = null;
                    is_poing_namestxt = false;
                }
            }

            var js_fields_str = String.Join("\r\n", res_dict.Select(item => "\"" + item.Key + "\":" + "[\"" + item.Value + "\"],").ToList());

            var outp_js_str = "var po_LangOrder = {ru: 0};\r\n" +            
                String.Format("var po_Translate = {{{0}}};", js_fields_str);
            File.WriteAllText("outp.js", outp_js_str, Encoding.UTF8);
        }
    }
}
