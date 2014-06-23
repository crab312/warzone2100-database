<?php
header('Location: '.str_replace(".php",".html",basename($_SERVER['REQUEST_URI']))); //redirect to .html version of this page (to keep old links working)
exit;
include("structure.html");
ob_start('ob_gzhandler'); //enables compression 
?>

<script type='text/javascript'>
<?php
//$php_array = array('abc','def','ghi');
$js_array = array_merge(scandir("data_icons/Weapon"), scandir("data_icons/Structures"), scandir("data_icons/SupportTurrets"));
$js_hash_array = array();
foreach ($js_array as &$value) {
    $js_hash_array[$value] = 1;
}
echo "var icon_files_hash = ". json_encode($js_hash_array) . ";\n";
?>
</script>