'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle, Heart, Share2 } from 'lucide-react'
import { Skeleton } from "@/components/ui/skeleton"

interface Author {
  did: string
  handle: string
  displayName: string
  avatar: string
}

interface NewsPost {
  uri: string
  cid: string
  author: Author
  record: {
    createdAt: string
    text: string
  }
  replyCount: number
  repostCount: number
  likeCount: number
  indexedAt: string
}

function NewsPost({ author, record, replyCount, repostCount, likeCount }: NewsPost) {
  return (
    <Card className="mb-6 hover:bg-amber-50 transition-colors duration-200 border-amber-200">
      <CardContent className="pt-4">
        <div className="flex items-start space-x-4">
          <Avatar>
            <AvatarImage src={author.avatar} />
            <AvatarFallback>{author.displayName[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-amber-800">{author.displayName}</span>
              <span className="text-gray-500">@{author.handle}</span>
              <span className="text-gray-500">·</span>
              <span className="text-gray-500">{new Date(record.createdAt).toLocaleString()}</span>
            </div>
            <p className="mt-2 text-gray-700">{record.text}</p>
            <div className="flex justify-between mt-4 text-gray-500">
              <Button variant="ghost" size="sm" className="flex items-center space-x-2 hover:text-amber-600">
                <MessageCircle size={18} />
                <span>{replyCount}</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center space-x-2 hover:text-amber-600">
                <Heart size={18} />
                <span>{likeCount}</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center space-x-2 hover:text-amber-600">
                <Share2 size={18} />
                <span>{repostCount}</span>
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
    <Card className="mb-6 border-amber-200">
      <CardContent className="pt-4">
        <div className="flex items-start space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
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

export function Page() {
  const [posts, setPosts] = useState<NewsPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        const response = await fetch('https://milharal-news-production.up.railway.app/service/RelevantPotopsts')
        const data = await response.json()
        setPosts(data)
      } catch (error) {
        console.error('Erro ao buscar posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-amber-50 text-gray-800">
      <header className="bg-white border-b border-amber-200 p-4 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold flex items-center">
            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/176400544-fel2RpdX4Aa1vGTUCNYHJEz03Y5LpG.png" alt="Milho News Logo" className="h-10 mr-2" />
            <span className="text-amber-600">Milho</span>
            <span className="text-gray-700">News</span>
          </Link>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-amber-800">Destaque do dia</h2>
              {loading ? (
                <NewsPostSkeleton />
              ) : (
                posts.length > 0 && <NewsPost {...posts[0]} />
              )}
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-amber-800">Publicações Recentes</h2>
              {loading ? (
                <>
                  <NewsPostSkeleton />
                  <NewsPostSkeleton />
                  <NewsPostSkeleton />
                </>
              ) : (
                posts.slice(1).map(post => (
                  <NewsPost key={post.cid} {...post} />
                ))
              )}
            </section>
          </div>
        </div>
      </main>

      <footer className="bg-white text-gray-600 py-8 border-t border-amber-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between">
            <div className="w-full md:w-1/3 mb-4 md:mb-0">
              <h3 className="text-xl font-bold mb-2 text-amber-800">Sobre o Milho News</h3>
              <p className="text-sm">
              Milho News é o seu site diário de notícias e atualizações do mundo do desenvolvimento de software. Aqui, você encontra os posts mais legais do Bluesky, com tudo que envolve TI: novidades, curiosidades, brincadeiras e até memes! Fique ligado nas tendências e nas conversas que agitam a comunidade tech, seja você um dev, um entusiasta ou só alguém curioso!.</p>
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