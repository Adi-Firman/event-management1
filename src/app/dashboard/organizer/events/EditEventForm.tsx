const authToken = localStorage.getItem('token')

const res = await fetch('http://localhost:5000/api/events/1', {
  headers: {
    Authorization: `Bearer ${authToken}`,
  },
})

export {}
