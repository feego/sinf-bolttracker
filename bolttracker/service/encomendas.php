<?php 
require 'defs.php';
$URL= $BASE_URL. "encomendas";

$data_string = json_encode($_POST['filters']);

curl_setopt($ch, CURLOPT_URL,$URL);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    'Content-Type: application/json',
    'Content-Length: ' . strlen($data_string))
);
$encomendas=curl_exec($ch);

echo json_encode($encomendas);
?>