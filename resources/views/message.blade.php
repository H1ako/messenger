<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="_token" content="{{ csrf_token() }}">
    <title>Messages</title>
    <link rel="stylesheet" href="/css/message.css">
</head>
<body>
    <div id='messages-area'>

    </div>
    <div class="">
        <a href="/">Home</a>
    </div>
    <!-- React -->
    <script src="https://unpkg.com/react@17/umd/react.development.js" crossorigin></script>
    <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js" crossorigin></script>
    <!-- JSX -->
    <script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
    <!-- Main -->
    <script type='text/babel' src='{{asset('js/message.js')}}'></script>
</body>
</html>