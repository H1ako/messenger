<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="_token" content="{{ csrf_token() }}">
    <title>Friends</title>
    <link rel="stylesheet" href="/css/login.css">
</head>
<body>
    {{Auth::user()}}
    <div class="">
        <a href="/">Home</a>
    </div>
    <div id="app">

    </div>
    
    {{-- <script type="text/babel" src='js/login.js?v=2'></script> --}}
    {{-- <script src="{{ asset('js/app.js') }}"></script> --}}
    <script src="{{ asset('js/app.js') }}"></script>
</body>
</html>