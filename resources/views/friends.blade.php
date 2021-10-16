<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="_token" content="{{ csrf_token() }}">
    <title>Friends</title>
    <link rel="stylesheet" href="/css/friends.css">
</head>
<body>
    <div id="app">

    </div>
    {{-- <script type="text/babel" src='js/friends.js?v=2'></script> --}}
    <script src="{{ asset('js/app.js') }}"></script>
</body>
</html>