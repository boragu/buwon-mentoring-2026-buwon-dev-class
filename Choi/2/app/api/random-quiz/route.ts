import { buildRandomQuiz } from '@/lib/random-quiz'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const questions = await buildRandomQuiz()
    return Response.json({ questions }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('[random-quiz]', error)
    return Response.json({ error: '포켓몬 데이터를 불러오지 못했어요.' }, { status: 502 })
  }
}
