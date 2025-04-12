'use client'

import { useSession, useUser } from '@clerk/nextjs'
import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { List, ListHeader } from 'components/List/List'


export default function VotersList() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [voters, setVoters] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [voterName, setVoterName] = useState('')
  const [voterSurname, setVoterSurname] = useState('')
  const [voterCPF, setVoterCPF] = useState('')

  const { user } = useUser()
  const { session } = useSession()

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

  const supabaseClient = createClerkSupabaseClient()

  // This `useEffect` will wait for the User object to be loaded before requesting
  // the tasks for the logged in user
  useEffect(() => {
    if (!user) return

    async function loadVoters() {
      setLoading(true)

      const { data, error } = await supabaseClient.from('voters').select()
      if (!error) {
        setVoters(data)
      } else {
        console.error('Error loading voters:', error)
      }
      setLoading(false)
    }

    loadVoters()
  }, [user])

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

  const listHeaders: ListHeader[] = [
    {
      name: 'Nome',
      key: 'name',
    },
    {
      name: 'Sobrenome',
      key: 'surname',
    },
    {
      name: 'CPF',
      key: 'cpf',
    },
  ]

  return (
    <div>
      {loading && <p>Loading...</p>}

      <List listName="Voters" listHeaders={listHeaders} listItems={voters} />

      {/* {!loading && voters.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Surname</th>
              <th>CPF</th>
            </tr>
          </thead>
          <tbody>
            {voters.map((voter: any) => (
              <tr key={voter.id}>
                <td>{voter.name}</td>
                <td>{voter.surname}</td>
                <td>{voter.cpf}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )} */}


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