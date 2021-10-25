<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="_token" content="{{ csrf_token() }}">
    <title>Friends</title>
    <link rel="stylesheet" href="/css/app.css">
</head>
<body>
    <div id='app'></div>
    <?php $now = new DateTime();?>
    <script src="{{ asset('js/app.js') }}?<?=$now->format('H:i:s')?>"></script>
</body>
</html>