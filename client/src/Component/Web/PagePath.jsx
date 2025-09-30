import React from 'react'

const PagePath = ({ title }) => {
    return (
        <div className="relative bg-gradient-to-r from-primary to-indigo-600 text-white text-center py-16">
            <h1 className="text-5xl font-bold animate-fadeIn">{title}</h1>
            <nav className="mt-2 text-sm">
                <a href="/home" className="text-gray-200 hover:text-white transition">Home</a>
                <span className="mx-2">&gt;</span>
                <span>{title}</span>
            </nav>
        </div>
    )
}

export default PagePath