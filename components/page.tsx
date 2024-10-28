'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle, Heart, Share2, Search, Menu } from 'lucide-react'
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"

interface Author {
  did: string;
  handle: string;
  displayName: string;
  avatar: string;
}

interface NewsPost {
  uri: string;
  cid: string;
  author: Author;
  record: {
    createdAt: string;
    text: string;
  };
  replyCount: number;
  repostCount: number;
  likeCount: number;
  indexedAt: string;
}

interface SummaryData {
  summary: string;
}

function NewsPost({ author, record, replyCount, repostCount, likeCount, uri }: NewsPost) {
  const id = uri.split('/').pop()
  const url = `https://bsky.app/profile/${author.handle}/post/${id}`
  const profileUrl = `https://bsky.app/profile/${author.handle}`;

  return (
    <Card className="mb-6 bg-transparent border-gray-200 shadow-sm transition-colors duration-200">
      <CardContent className="pt-6">
        <div className="flex items-start space-x-4">
          <Avatar className="w-12 h-12 border border-gray-200 flex-shrink-0">
            <Link href={profileUrl} className="cursor-pointer">
              <AvatarImage src={author.avatar} />
              <AvatarFallback>{author.displayName[0]}</AvatarFallback>
            </Link>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col space-y-1">
              <span className="font-semibold text-gray-800 text-lg truncate">
                {author.displayName}
              </span>
              <span className="text-gray-500 text-sm truncate">@{author.handle}</span>
              <span className="text-gray-500 text-sm">
                {new Date(record.createdAt).toLocaleString()}
              </span>
            </div>
            <p className="mt-2 text-gray-700 text-base leading-relaxed">
              {record.text}
            </p>
            <div className="flex justify-between mt-4 text-gray-500">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2 hover:text-gray-700"
              >
                <a href={url} target="_blank" rel="noopener noreferrer">
                  <MessageCircle size={18} />
                  <span>{replyCount}</span>
                </a>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2 hover:text-gray-700"
              >
                <a href={url} target="_blank" rel="noopener noreferrer">
                  <Heart size={18} />
                  <span>{likeCount}</span>
                </a>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2 hover:text-gray-700"
              >
                <a href={url} target="_blank" rel="noopener noreferrer">
                  <Share2 size={18} />
                  <span>{repostCount}</span>
                </a>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function NewsPostSkeleton() {
  return (
    <Card className="mb-6 border-gray-200 shadow-sm">
      <CardContent className="pt-6">
        <div className="flex items-start space-x-4">
          <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-20 w-full" />
            <div className="flex justify-between mt-4">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function Summary() {
  const [subtopics, setSubtopics] = useState<{ title: string, content: string }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true)
        const response = await fetch('https://clientgemini.onrender.com/summarize_posts')
        const data: SummaryData = await response.json()
        const subtopics = data.summary.split('**').reduce((acc, curr, index, array) => {
          if (index % 2 !== 0) {
            acc.push({ title: curr.trim(), content: array[index + 1]?.trim() || '' })
          }
          return acc
        }, [] as { title: string, content: string }[])
        setSubtopics(subtopics)
      } catch (error) {
        console.error('Erro ao buscar resumo:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSummary()
  }, [])

  return (
    <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b border-gray-200 pb-2">Fique por dentro</h2>
      {loading ? (
        <Skeleton className="h-20 w-full mb-4" />
      ) : (
        subtopics.map((subtopic, index) => (
          <div key={index} className="mb-4 last:mb-0">
            <h3 className="font-semibold text-gray-700 mb-2">{subtopic.title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{subtopic.content}</p>
          </div>
        ))
      )}
    </section>
  )
}

export default function Component() {
  const [posts, setPosts] = useState<NewsPost[]>([])
  const [filteredPosts, setFilteredPosts] = useState<NewsPost[]>([])
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        const response = await fetch('https://milharal-news.onrender.com/service/RelevantPotopsts')
        const data = await response.json()
        setPosts(data)
        setFilteredPosts(data)
      } catch (error) {
        console.error('Erro ao buscar posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  useEffect(() => {
    const filtered = posts.filter(post =>
      post.record.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.handle.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredPosts(filtered)
  }, [searchTerm, posts])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800 font-serif">
      <header className="bg-white border-b border-gray-200 p-4 shadow-sm sticky top-0 z-10">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
          <Link href="/" className="text-3xl font-bold flex items-center mb-4 sm:mb-0">
            <span className="text-gray-800">Milho News</span>
          </Link>
          <div className="flex items-center space-x-4 w-full sm:w-auto">
            <Input
              type="search"
              placeholder="Pesquisar..."
              className="w-full sm:w-64"
              value={searchTerm}
              onChange={handleSearch}
            />
            <Button variant="ghost" className="sm:hidden" onClick={() => setMenuOpen(!menuOpen)}>
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>
        {menuOpen && (
          <div className="sm:hidden mt-4">
            <Button variant="ghost" className="w-full justify-start">
              <Search className="w-5 h-5 mr-2" />
              Buscar
            </Button>
          </div>
        )}
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-3/5 xl:w-1/2">
            <section className="mb-8">
              <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b border-gray-200 pb-2">Destaque do dia</h2>
              {loading ? (
                <NewsPostSkeleton />
              ) : (
                filteredPosts.length > 0 && <NewsPost {...filteredPosts[0]} />
              )}
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b border-gray-200 pb-2">Publicações Recentes</h2>
              {loading ? (
                <>
                  <NewsPostSkeleton />
                  <NewsPostSkeleton />
                  <NewsPostSkeleton />
                </>
              ) : (
                filteredPosts.slice(1).map(post => (
                  <NewsPost key={post.cid} {...post} />
                ))
              )}
            </section>
          </div>

          <div className="w-full lg:w-2/5 xl:w-1/3">
            <Summary />
          </div>
        </div>
      </main>

      <footer className="bg-white text-gray-600 py-8 border-t border-gray-200 mt-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between">
            <div className="w-full md:w-1/2 mb-4 md:mb-0">
              <h3 className="text-xl font-bold mb-2 text-gray-800">Sobre o Milho News</h3>
              <p className="text-sm leading-relaxed">
                Milho News é o seu site diário de notícias e atualizações do mundo do desenvolvimento de software. Aqui, você encontra os posts mais relevantes do Bluesky, com tudo que envolve TI: novidades, tendências e discussões que agitam a comunidade tech.
              </p>
            </div>
            <div className="w-full md:w-1/4">
              <h3 className="text-xl font-bold mb-2 text-gray-800"></h3>
              <ul className="space-y-2">
                <li><Link href="https://github.com/MarlonJerold/milhonewsfront" className="hover:text-gray-800">Github</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} Milho News. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}