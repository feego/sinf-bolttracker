<?php 

$URL= $BASE_URL. "encomendas" .$_GET['filters'];

curl_setopt($ch,CURLOPT_URL,$URL);
curl_setopt($ch,CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch,CURLOPT_HTTPGET,true);

$encomendas=curl_exec($ch);

echo json_encode($encomendas);
?>