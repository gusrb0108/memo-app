import { Memo } from '@/types/memo'
import { supabase } from '@/lib/supabase'

export const supabaseUtils = {
  // 모든 메모 가져오기
  getMemos: async (): Promise<Memo[]> => {
    try {
      const { data, error } = await supabase
        .from('memos')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading memos from Supabase:', error)
        return []
      }

      // Supabase 결과를 Memo 인터페이스 형식으로 변환
      return data.map(memo => ({
        id: memo.id,
        title: memo.title,
        content: memo.content,
        category: memo.category,
        tags: memo.tags,
        createdAt: memo.created_at,
        updatedAt: memo.updated_at,
      }))
    } catch (error) {
      console.error('Error loading memos from Supabase:', error)
      return []
    }
  },

  // 메모 추가
  addMemo: async (memo: Memo): Promise<Memo | null> => {
    try {
      const { data, error } = await supabase
        .from('memos')
        .insert({
          id: memo.id,
          title: memo.title,
          content: memo.content,
          category: memo.category,
          tags: memo.tags,
        })
        .select()
        .single()

      if (error) {
        console.error('Error adding memo to Supabase:', error)
        return null
      }

      // Supabase 결과를 Memo 인터페이스 형식으로 변환
      return {
        id: data.id,
        title: data.title,
        content: data.content,
        category: data.category,
        tags: data.tags,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      }
    } catch (error) {
      console.error('Error adding memo to Supabase:', error)
      return null
    }
  },

  // 메모 업데이트
  updateMemo: async (updatedMemo: Memo): Promise<Memo | null> => {
    try {
      const { data, error } = await supabase
        .from('memos')
        .update({
          title: updatedMemo.title,
          content: updatedMemo.content,
          category: updatedMemo.category,
          tags: updatedMemo.tags,
        })
        .eq('id', updatedMemo.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating memo in Supabase:', error)
        return null
      }

      // Supabase 결과를 Memo 인터페이스 형식으로 변환
      return {
        id: data.id,
        title: data.title,
        content: data.content,
        category: data.category,
        tags: data.tags,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      }
    } catch (error) {
      console.error('Error updating memo in Supabase:', error)
      return null
    }
  },

  // 메모 삭제
  deleteMemo: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('memos')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting memo from Supabase:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error deleting memo from Supabase:', error)
      return false
    }
  },

  // 메모 검색
  searchMemos: async (query: string): Promise<Memo[]> => {
    try {
      const lowercaseQuery = query.toLowerCase()
      
      const { data, error } = await supabase
        .from('memos')
        .select('*')
        .or(`title.ilike.%${lowercaseQuery}%,content.ilike.%${lowercaseQuery}%`)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error searching memos in Supabase:', error)
        return []
      }

      // Supabase 결과를 Memo 인터페이스 형식으로 변환하고 태그 검색도 추가
      const allMemos = data.map(memo => ({
        id: memo.id,
        title: memo.title,
        content: memo.content,
        category: memo.category,
        tags: memo.tags,
        createdAt: memo.created_at,
        updatedAt: memo.updated_at,
      }))

      // 태그 검색을 위한 추가 필터링 (클라이언트 사이드)
      return allMemos.filter(memo => 
        memo.title.toLowerCase().includes(lowercaseQuery) ||
        memo.content.toLowerCase().includes(lowercaseQuery) ||
        memo.tags.some((tag: string) => tag.toLowerCase().includes(lowercaseQuery))
      )
    } catch (error) {
      console.error('Error searching memos in Supabase:', error)
      return []
    }
  },

  // 카테고리별 메모 필터링
  getMemosByCategory: async (category: string): Promise<Memo[]> => {
    try {
      let query = supabase
        .from('memos')
        .select('*')
        .order('created_at', { ascending: false })

      if (category !== 'all') {
        query = query.eq('category', category)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error loading memos by category from Supabase:', error)
        return []
      }

      // Supabase 결과를 Memo 인터페이스 형식으로 변환
      return data.map(memo => ({
        id: memo.id,
        title: memo.title,
        content: memo.content,
        category: memo.category,
        tags: memo.tags,
        createdAt: memo.created_at,
        updatedAt: memo.updated_at,
      }))
    } catch (error) {
      console.error('Error loading memos by category from Supabase:', error)
      return []
    }
  },

  // 특정 메모 가져오기
  getMemoById: async (id: string): Promise<Memo | null> => {
    try {
      const { data, error } = await supabase
        .from('memos')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error loading memo by id from Supabase:', error)
        return null
      }

      // Supabase 결과를 Memo 인터페이스 형식으로 변환
      return {
        id: data.id,
        title: data.title,
        content: data.content,
        category: data.category,
        tags: data.tags,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      }
    } catch (error) {
      console.error('Error loading memo by id from Supabase:', error)
      return null
    }
  },

  // 모든 메모 삭제
  clearMemos: async (): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('memos')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000') // 모든 레코드 삭제

      if (error) {
        console.error('Error clearing all memos from Supabase:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error clearing all memos from Supabase:', error)
      return false
    }
  },
}

// 기존 함수명과의 호환성을 위한 별칭
export const localStorageUtils = supabaseUtils
