'use client'

import { useSession, useUser } from '@clerk/nextjs'
import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

// The `Home` component will display a list of tasks for the logged in user
// This component is an example of how to use Clerk with Supabase in the client side

export default function Home() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [tasks, setTasks] = useState<any[]>([])
  const [voters, setVoters] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [voterName, setVoterName] = useState('')
  const [voterSurname, setVoterSurname] = useState('')
  const [voterCPF, setVoterCPF] = useState('')
  // The `useUser()` hook will be used to ensure that Clerk has loaded data about the logged in user
  const { user } = useUser()
  // The `useSession()` hook will be used to get the Clerk session object
  const { session } = useSession()

  // Create a custom supabase client that injects the Clerk Supabase token into the request headers
  function createClerkSupabaseClient() {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        async accessToken() {
        return session?.getToken() ?? null
        },
      }
    )
  }

  // Create a `client` object for accessing Supabase data using the Clerk token
  const supabaseClient = createClerkSupabaseClient()

  // This `useEffect` will wait for the User object to be loaded before requesting
  // the tasks for the logged in user
  useEffect(() => {
    if (!user) return

    async function loadTasks() {
      setLoading(true)
      const { data, error } = await supabaseClient.from('tasks').select()
      if (!error) setTasks(data)
      setLoading(false)
    }

    async function loadVoters() {
      const { data, error } = await supabaseClient.from('voters').select()
      if (!error) {
        setVoters(data)
      } else {
        console.error('Error loading voters:', error)
      }
    }

    loadTasks()
    loadVoters()
  }, [user])

  async function createTask(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // Insert task into the "tasks" database
    await supabaseClient.from('tasks').insert({
      name,
    })
    window.location.reload()
  }

    async function createVoter(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // Insert voter into the "voters" database
    await supabaseClient.from('voters').insert({
      name: voterName,
      surname: voterSurname,
      cpf: voterCPF,
    })
    window.location.reload()
  }

  return (
    <div>
      <h1>Tasks</h1>

      {loading && <p>Loading...</p>}

      {!loading && tasks.length > 0 && tasks.map((task: any) => <p key={task.id}>{task.name}</p>)}

      {!loading && tasks.length === 0 && <p>No tasks found</p>}

      <form onSubmit={createTask}>
        <input
          autoFocus
          type="text"
          name="name"
          placeholder="Enter new task"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        <button type="submit">Add</button>
      </form>

      <br />
      <h1>Voters</h1>
      {loading && <p>Loading...</p>}

      {!loading && voters.length > 0 && voters.map((voter: any) => <p key={voter.id}>{voter.name}</p>)}

      {!loading && voters.length === 0 && <p>No voters found</p>}

      <form onSubmit={createVoter}>
        <input
          autoFocus
          type="text"
          name="voter-name"
          placeholder="name"
          onChange={(e) => setVoterName(e.target.value)}
          value={voterName}
        />
        <input
          autoFocus
          type="text"
          name="voter-surname"
          placeholder="surname"
          onChange={(e) => setVoterSurname(e.target.value)}
          value={voterSurname}
        />
        <br />
        <input
          autoFocus
          type="text"
          name="voter-cpf"
          placeholder="cpf"
          onChange={(e) => setVoterCPF(e.target.value)}
          value={voterCPF}
        />
        <button type="submit">Add</button>
      </form>
    </div>
  )
}