<?PHP
//SQL.php

	session_start();
	$_file = fopen("./DB_info.ig.json", "r");
	$_string = fread($_file, 1024);
	$_iValue = json_decode($_string, True);


	echo "<pre>";
	print_r($_iValue);
	if(!array_key_exists("id", $_iValue) || !array_key_exists("password", $_iValue) || !array_key_exists("server", $_iValue)) {
		die("not good DB_info file");
	}
	$_SESSION["id"] = $_iValue["id"];
	$_SESSION["password"] = $_iValue["password"];
	$_SESSION["server"] = $_iValue["server"];

	$_link = mysql_connect($_SESSION["server"], $_SESSION["id"], $_SESSION["password"]);
	if(!$_link) {
		die("unable to connect!");
	}


?>