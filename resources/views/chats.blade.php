<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="_token" content="{{ csrf_token() }}">
    <title>Messages</title>
    <link rel="stylesheet" href="/css/chats.css">
</head>
<body>
    <div id="app">
        
    </div>
    <a href="/">Home</a>
    <!-- Main -->
    {{-- <script type='text/babel' src='{{asset('js/message.js')}}'></script> --}}
    <script src="{{ asset('js/app.js') }}"></script>
</body>
</html>