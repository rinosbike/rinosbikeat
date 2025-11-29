/**
 * Category Tree Builder
 * Converts flat category array into hierarchical tree structure
 */

import { Category } from './api'

export interface CategoryNode extends Category {
  children: CategoryNode[]
  level: number
  parent?: CategoryNode
}

/**
 * Build a hierarchical tree from flat category array
 * Uses categorypath to determine hierarchy (e.g., "Fahrräder - Rennräder - Gravel Bikes")
 */
export function buildCategoryTree(categories: Category[]): CategoryNode[] {
  const tree: CategoryNode[] = []
  const categoryMap = new Map<string, CategoryNode>()

  // Sort categories by path depth (shallower first)
  const sorted = categories
    .filter(cat => cat.category && cat.category !== '0') // Filter out invalid categories
    .sort((a, b) => {
      const depthA = (a.categorypath?.split(' - ').length || 0)
      const depthB = (b.categorypath?.split(' - ').length || 0)
      return depthA - depthB
    })

  for (const category of sorted) {
    const node: CategoryNode = {
      ...category,
      children: [],
      level: 0,
    }

    // Parse category path to determine level and parent
    const path = category.categorypath || ''
    const parts = path.split(' - ').map(p => p.trim()).filter(p => p)

    node.level = parts.length

    if (parts.length === 0 || parts.length === 1) {
      // Root level category
      tree.push(node)
      categoryMap.set(category.category, node)
    } else {
      // Find parent
      const parentPath = parts.slice(0, -1).join(' - ')
      const parentName = parts[parts.length - 2]

      // Try to find parent in map
      let parent = categoryMap.get(parentName)

      if (!parent) {
        // Try searching by path
        for (const [key, value] of categoryMap.entries()) {
          if (value.categorypath?.endsWith(parentPath)) {
            parent = value
            break
          }
        }
      }

      if (parent) {
        parent.children.push(node)
        node.parent = parent
      } else {
        // If no parent found, add to root
        tree.push(node)
      }

      categoryMap.set(category.category, node)
    }
  }

  return tree
}

/**
 * Get top-level categories (e.g., Fahrräder, Zubehör, Bekleidung)
 */
export function getTopLevelCategories(tree: CategoryNode[]): CategoryNode[] {
  return tree.filter(node => node.level <= 1)
}

/**
 * Find a category by ID in the tree
 */
export function findCategoryById(tree: CategoryNode[], id: number): CategoryNode | null {
  for (const node of tree) {
    if (node.categoryid === id) return node
    if (node.children.length > 0) {
      const found = findCategoryById(node.children, id)
      if (found) return found
    }
  }
  return null
}

/**
 * Get category breadcrumb path
 */
export function getCategoryBreadcrumb(node: CategoryNode): CategoryNode[] {
  const breadcrumb: CategoryNode[] = [node]
  let current = node.parent
  while (current) {
    breadcrumb.unshift(current)
    current = current.parent
  }
  return breadcrumb
}
