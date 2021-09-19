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
    <div id="message-area">
        @foreach ($messages as $message)
        
        @if ($message->sender != $user_id)
        <div class='message-area__message'>
            <div class='message-name'><?=$message->sender_name?></div>
            
            <div class='message-content'>
                <div class='message-content__time'><?=$message->time?></div>
                <div class='message-content__text'><?=$message->text?></div>
            </div>
        </div>

        @else
        <div class='message-area__message user-message'>
            <div class='message-content'>
                <div class='message-content__time'><?=$message->time?></div>
                <div class='message-content__text'><?=$message->text?></div>
            </div>
        </div>
        @endif
        @endforeach
    </div>
    <input id='new_message_text' type='text' name='new_message_text' placeholder='Type Here'>
    <label for="new_message_text">
        <button id='message_send'>Send</button>
    </label>
    <div class="">
        <a href="/">Home</a>
    </div>
    <!-- React -->
    <script src="https://unpkg.com/react@17/umd/react.development.js" crossorigin></script>
    <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js" crossorigin></script>
    <!-- JSX -->
    <script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
    <!-- Main -->
    <script type="text/babel" src='js/message.js'></script>
</body>
</html>