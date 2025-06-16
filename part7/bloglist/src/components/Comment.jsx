const Comment = ({ comment }) => {
    return (
        <div style={{ padding: '5px', border: '1px solid gray', margin: '5px 0' }}>
            {comment.content}
        </div>
    )
}

export default Comment