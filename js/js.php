<?php
    header('Content-Type: application/javascript');
?>

$(document).ready(function() {

    <?php
    foreach (glob('/include/*.js') as $filename)
    {
        include $filename;
    }

    ?>
})