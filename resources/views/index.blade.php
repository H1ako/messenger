<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="_token" content="{{ csrf_token() }}">
    <title>Home</title>
    <link rel="stylesheet" href="/css/index.css">
</head>
<body>
    <button id='logOut'>Log Out</button>
    {{Auth::user()}} - {{Auth::user()->id}}
    <div id='app'>

    </div>
    <!-- Main -->
    {{-- <script type="text/babel" src='js/index.js?v=2'></script> --}}
    {{-- <script src="{{ asset('js/app.js') }}"></script> --}}
    <script src="{{ asset('js/app.js') }}"></script>
    <script src="{{ asset('js/logOut.js') }}"></script>
</body>
</html>