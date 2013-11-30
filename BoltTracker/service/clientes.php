<?php 
require 'defs.php';

$URL= $BASE_URL. "clientes?idCliente=" .$_GET['id']. "&hash=" .$_GET['hash'];

curl_setopt($ch,CURLOPT_URL,$URL);
curl_setopt($ch,CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch,CURLOPT_HTTPGET,true);

$cliente=curl_exec($ch);
echo json_encode($cliente);
?>