const Messages = ({messages}) => {
    return (
        <div id="messagesContainer">
            <div>Chat History</div>
            {messages.map((message) => {
                return (
                    <div>{message}</div>
                )
            })}
        </div>
    )
}

export default Messages;