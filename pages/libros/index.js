import Link from "next/link";
import {useRouter} from "next/router";

export async function getStaticProps() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books`)
    const data = await res.json()
    return {
        props: {
            books: data
        }
    }
}

const BookList = ({ books }) => {
    const router = useRouter();
    async function handleDelete(e, bookId) {
        e.preventDefault()
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books/${bookId}`, {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                _method: 'DELETE',
            }),
        })

        if (res.ok) {
            // success
            return router.push('/libros')
            //window.location.reload()
            //window.location.href = '/libros'
        }
    }
    return (
        <div>
            <h1>List Books</h1>
            <ul data-cy="book-list">
                {books.map( (book) => (
                    <li key={`book-${book.id}`}>
                        <Link
                            data-cy={`link-to-visit-book-${book.id}`}
                            href={`/libros/${book.id}`}
                        >
                        {book.title}
                        </Link>
                        {' - '}
                        <Link
                            data-cy={`link-to-edit-book-${book.id}`}
                            href={`/libros/${book.id}/editar`}
                        >
                            Editar
                        </Link>
                        {' - '}
                        <form onSubmit={(e) => handleDelete(e, book.id)}
                        style={{ display: 'inline' }}
                        >
                            <button
                                data-cy={`link-to-delete-book-${book.id}`}
                            >Eliminar</button>
                        </form>
                    </li>
                ))}
            </ul>
            <Link href="/libros/crear">Create Book</Link>
        </div>
    )
}

export default BookList