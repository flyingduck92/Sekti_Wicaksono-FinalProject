import React from 'react'

function ToolList() {
  return (
    <section>
      <div>ToolList</div>
      <form action="toolhandlerAdd">
        <div>
          <label htmlFor="code">Code</label>
          <input type="text" name='code' />
        </div>
        <div>
          <label htmlFor="name">Name</label>
          <input type="text" name='name' />
        </div>
        <div>
          <label htmlFor="price">Price</label>
          <input type="number" name='price' />
        </div>
        <div>
          <label htmlFor="stock">Number</label>
          <input type="number" name='stock' />
        </div>
        <div>
          <label htmlFor="imageUrl">Image Url</label>
          <input type="text" name='imageUrl' />
        </div>
      </form>
    </section>
  )
}

export default ToolList