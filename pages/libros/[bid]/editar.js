import Link from "next/link";
import {useState} from "react";
import {useRouter} from "next/router";

export async function getServerSideProps({params}) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books/${params.bid}`)
    const data = await res.json()
    return {
        props: {
            book: data
        }
    }
}

const BookEdit = ({ book }) => {
    const router = useRouter();
    const [bookTitle, setBookTitle] = useState(book.title)
    const [errors, setErrors] = useState([])
    const [submitting, setSubmitting] = useState(false)

    async function handleSubmit (e) {
        e.preventDefault();
        setSubmitting(true)
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books/${book.id}`, {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: bookTitle,
                _method: 'PATCH'
            }),
        })

        if (res.ok) {
            // success
            setErrors([])
            setBookTitle('')
            return router.push('/libros')
        } else {
            // error
            const data = await res.json()
            setErrors(data.errors)
        }
        setSubmitting(false)
    }
    return (
        <>
            <h1>Edit Book</h1>
            <form onSubmit={handleSubmit}>
                <input
                    onChange={(e) => setBookTitle(e.target.value)}
                    value={String(bookTitle)}
                    disabled={submitting}
                    type="text"
                    data-cy="input-book-title"
                />
                <br/>
                {errors.title && (
                    <p
                        style={{
                            color: "red"
                        }}
                    >{errors.title}</p>
                )}
                <button
                    disabled={submitting}
                    data-cy="button-update-book"
                >{submitting ? 'Enviando...' : 'Enviar'}</button>
            </form>
            <br />
            <Link href="/libros">Book List</Link>
        </>
    )
}

export default BookEdit