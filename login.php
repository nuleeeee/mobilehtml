<?php
include "config/session.php";

$pin = $_POST['login_pin'];

$pin = validate($_POST['login_pin']);

$sql = "SELECT  position, nameidxx as nameidz, CONCAT(firstname,' ',lastname) as vname, pin, bridz, vnamenew.hide 
FROM vlookup_mcore.vnamenew
LEFT OUTER JOIN vlookup_mcore.vemployeeposition ON vlookup_mcore.vemployeeposition.positionidxx = vlookup_mcore.vnamenew.positionidz
WHERE pin = '{$pin}' AND vnamenew.hide = 0";

$result = mysqli_query($db, $sql);

if (mysqli_num_rows($result) === 1) {
    $row = mysqli_fetch_assoc($result);
    if ($row['pin'] === $pin) {
        $_SESSION['login_user'] = $row["nameidz"];
        $_SESSION['user_position'] = $row["position"];
        $_SESSION['branch'] = $row["bridz"];

        echo json_encode(["vname" => $row["vname"], "branch" => $row["bridz"]]);
    } else {
        echo 1;
    }
} else {
    echo 1;
}

function validate($data)
{
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}