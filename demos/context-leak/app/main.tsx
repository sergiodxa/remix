import { createRoot, on, type Handle } from 'remix/component'

// Each entry is a component that stays mounted while it is one of the last 50.
function Entry(handle: Handle<{ n: number }>) {
  return () => <li>Entry {handle.props.n}</li>
}

function App(handle: Handle) {
  let count = 0
  return () => (
    <main>
      <button
        id="add"
        type="button"
        mix={on('click', () => {
          count++
          handle.update()
        })}
      >
        Add entry
      </button>
      <ol>
        {Array.from({ length: Math.min(count, 50) }, (_, i) => count - i).map((n) => (
          <Entry key={n} n={n} />
        ))}
      </ol>
    </main>
  )
}

createRoot(document.getElementById('app')!).render(<App />)
