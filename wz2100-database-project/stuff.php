<?php
$filename = $_GET['url'];
if($filename === null)
{
    echo "Hello. Bye.";
}

$file_info = pathinfo($filename);
if ($file_info["extension"] === "ini")
{
    
    $ini = parse_ini_file($filename,true);
    //$fields = array();
    //foreach ($ini as $section) {
        
    //    foreach ($section as $key => $value) {
    //        array_push($fields, $key);
    //        array_push($fields, 14);
    //        echo "Ключ: $key; Значение: $value<br />\n";
    //    }
    //}
    ob_start('ob_gzhandler'); //enables compression 
    echo json_encode($ini);
}

?>