import { useMemo, useState, useCallback, useRef } from 'react'
import ForceGraph2D from 'react-force-graph-2d'
import { motion } from 'framer-motion'
import { ingredients } from '../../data/ingredients'
import { useUserPreferences } from '../../contexts/UserPreferencesContext'
import { mockUserInsights } from '../../data/mockData'
import AnimatedCard from '../common/AnimatedCard'
import './IngredientNetworkGraph.css'

const IngredientNetworkGraph = () => {
  const { preferences } = useUserPreferences()
  const [filter, setFilter] = useState('all') // 'all', 'conflicts', 'compatible'
  const [hoveredNode, setHoveredNode] = useState(null)
  const [selectedNode, setSelectedNode] = useState(null)
  const graphRef = useRef()

  // Determine ingredient status based on user fingerprint
  const getIngredientStatus = useCallback((ingredientId) => {
    const likelyWorks = mockUserInsights.likelyWorks.map(item => item.ingredient)
    const possibleTriggers = mockUserInsights.possibleTriggers.map(item => item.ingredient)
    const disliked = preferences?.disliked_ingredients || []

    if (likelyWorks.includes(ingredientId)) return 'works'
    if (disliked.includes(ingredientId)) return 'avoid'
    if (possibleTriggers.includes(ingredientId)) return 'suspect'
    return 'neutral'
  }, [preferences])

  // Build graph data
  const graphData = useMemo(() => {
    const nodes = ingredients.map(ing => ({
      id: ing.id,
      name: ing.name,
      category: ing.category,
      status: getIngredientStatus(ing.id),
      description: ing.description
    }))

    const links = []
    const linkSet = new Set()

    ingredients.forEach(ing => {
      // Add conflict links (red)
      ing.conflicts?.forEach(conflictId => {
        const linkKey = [ing.id, conflictId].sort().join('-')
        if (!linkSet.has(linkKey)) {
          linkSet.add(linkKey)
          links.push({
            source: ing.id,
            target: conflictId,
            type: 'conflict',
            value: 2
          })
        }
      })

      // Add compatible links (green)
      ing.compatibleWith?.forEach(compatId => {
        const linkKey = [ing.id, compatId].sort().join('-')
        if (!linkSet.has(linkKey)) {
          linkSet.add(linkKey)
          links.push({
            source: ing.id,
            target: compatId,
            type: 'compatible',
            value: 1
          })
        }
      })
    })

    // Filter based on selected filter
    let filteredLinks = links
    if (filter === 'conflicts') {
      filteredLinks = links.filter(link => link.type === 'conflict')
    } else if (filter === 'compatible') {
      filteredLinks = links.filter(link => link.type === 'compatible')
    }

    // Filter nodes to only show those with connections (if filtered)
    let filteredNodes = nodes
    if (filter !== 'all') {
      const connectedNodeIds = new Set()
      filteredLinks.forEach(link => {
        connectedNodeIds.add(link.source)
        connectedNodeIds.add(link.target)
      })
      filteredNodes = nodes.filter(node => connectedNodeIds.has(node.id))
    }

    return { nodes: filteredNodes, links: filteredLinks }
  }, [filter, getIngredientStatus])

  // Node color based on status
  const getNodeColor = (node) => {
    switch (node.status) {
      case 'works':
        return '#4CAF50' // Green
      case 'avoid':
        return '#F44336' // Red
      case 'suspect':
        return '#FF9800' // Orange/Yellow
      default:
        return '#9E9E9E' // Gray
    }
  }

  // Link color based on type
  const getLinkColor = (link) => {
    return link.type === 'conflict' ? '#F44336' : '#4CAF50'
  }

  // Get emoji icon for canvas rendering - using relevant icons like pills and bottles
  const getIconEmoji = useCallback((category, id) => {
    const emojiMap = {
      'active': '💊',
      'exfoliant': '🧴',
      'hydrating': '💧',
      'barrier': '🧴',
      'antioxidant': '💊',
    }
    
    // Special cases for specific ingredients
    const specialEmojis = {
      'niacinamide': '💊',
      'vitamin-c': '💊',
      'retinol': '💊',
      'peptides': '💊',
      'vitamin-e': '💊',
      'hyaluronic-acid': '🧴',
      'ceramides': '🧴',
      'aha': '🧴',
      'bha': '🧴',
    }
    
    return specialEmojis[id] || emojiMap[category] || '💊'
  }, [])

  const handleNodeClick = useCallback((node) => {
    setSelectedNode(selectedNode?.id === node.id ? null : node)
  }, [selectedNode])

  const handleNodeHover = useCallback((node) => {
    setHoveredNode(node)
  }, [])

  return (
    <AnimatedCard className="ingredient-network-container">
      <div className="ingredient-network-header">
        <h2>Ingredient Network</h2>
        <p className="ingredient-network-subtitle">
          Explore ingredient relationships and compatibility
        </p>
      </div>

      <div className="ingredient-network-filters">
        <button
          className={`ingredient-network-filter ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`ingredient-network-filter ${filter === 'conflicts' ? 'active' : ''}`}
          onClick={() => setFilter('conflicts')}
        >
          Conflicts Only
        </button>
        <button
          className={`ingredient-network-filter ${filter === 'compatible' ? 'active' : ''}`}
          onClick={() => setFilter('compatible')}
        >
          Compatible Only
        </button>
      </div>

      <div className="ingredient-network-legend">
        <div className="ingredient-network-legend-item">
          <div className="ingredient-network-legend-color" style={{ backgroundColor: '#4CAF50' }}></div>
          <span>Works for you</span>
        </div>
        <div className="ingredient-network-legend-item">
          <div className="ingredient-network-legend-color" style={{ backgroundColor: '#FF9800' }}></div>
          <span>Possible trigger</span>
        </div>
        <div className="ingredient-network-legend-item">
          <div className="ingredient-network-legend-color" style={{ backgroundColor: '#F44336' }}></div>
          <span>Avoid</span>
        </div>
        <div className="ingredient-network-legend-item">
          <div className="ingredient-network-legend-color" style={{ backgroundColor: '#9E9E9E' }}></div>
          <span>Neutral</span>
        </div>
        <div className="ingredient-network-legend-item">
          <div className="ingredient-network-legend-line" style={{ borderColor: '#4CAF50' }}></div>
          <span>Compatible</span>
        </div>
        <div className="ingredient-network-legend-item">
          <div className="ingredient-network-legend-line" style={{ borderColor: '#F44336' }}></div>
          <span>Conflict</span>
        </div>
      </div>

      <div className="ingredient-network-graph-wrapper">
        <ForceGraph2D
          ref={graphRef}
          graphData={graphData}
          nodeLabel={(node) => `${node.name}\n${node.description}`}
          nodeColor={getNodeColor}
          nodeVal={(node) => {
            // Smaller size based on number of connections
            const connections = graphData.links.filter(
              link => link.source === node.id || link.target === node.id
            ).length
            return 12 + connections * 1.5
          }}
          linkColor={getLinkColor}
          linkWidth={(link) => link.type === 'conflict' ? 3 : 2}
          linkDirectionalArrowLength={6}
          linkDirectionalArrowRelPos={1}
          // Spread out the network with longer connections
          linkDistance={250}
          linkStrength={0.3}
          nodeRepulsion={200}
          d3AlphaDecay={0.02}
          d3VelocityDecay={0.4}
          // Custom node rendering with icons
          nodeCanvasObject={(node, ctx, globalScale) => {
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            
            const nodeColor = getNodeColor(node)
            
            // Calculate smaller node size based on connections
            const connections = graphData.links.filter(
              link => link.source === node.id || link.target === node.id
            ).length
            const nodeSize = 12 + connections * 1.5
            
            // Draw background circle with border
            ctx.beginPath()
            ctx.arc(node.x, node.y, nodeSize, 0, 2 * Math.PI, false)
            ctx.fillStyle = nodeColor
            ctx.fill()
            ctx.strokeStyle = '#fff'
            ctx.lineWidth = 2 / Math.max(globalScale, 0.5)
            ctx.stroke()
            
            // Draw icon emoji (smaller)
            const iconEmoji = getIconEmoji(node.category, node.id)
            ctx.fillStyle = '#fff'
            ctx.font = `${Math.max(nodeSize * 0.7, 10)}px Arial`
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillText(iconEmoji, node.x, node.y)
          }}
          nodeCanvasObjectMode={() => 'replace'}
          onNodeClick={handleNodeClick}
          onNodeHover={handleNodeHover}
          cooldownTicks={100}
          onEngineStop={() => {
            if (graphRef.current) {
              // Zoom out for initial display
              graphRef.current.zoomToFit(400, 50)
              // Additional zoom out
              setTimeout(() => {
                if (graphRef.current) {
                  const currentZoom = graphRef.current.zoom()
                  graphRef.current.zoom(currentZoom * 0.7)
                }
              }, 100)
            }
          }}
        />
      </div>

      {hoveredNode && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="ingredient-network-tooltip"
        >
          <h3>{hoveredNode.name}</h3>
          <p>{hoveredNode.description}</p>
          <span className={`ingredient-network-status ingredient-network-status--${hoveredNode.status}`}>
            {hoveredNode.status === 'works' && '✅ Works for you'}
            {hoveredNode.status === 'avoid' && '⛔ Avoid'}
            {hoveredNode.status === 'suspect' && '⚠️ Possible trigger'}
            {hoveredNode.status === 'neutral' && '⚪ Neutral'}
          </span>
        </motion.div>
      )}

      {selectedNode && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="ingredient-network-details"
        >
          <div className="ingredient-network-details-header">
            <h3>{selectedNode.name}</h3>
            <button onClick={() => setSelectedNode(null)}>×</button>
          </div>
          <p className="ingredient-network-details-description">{selectedNode.description}</p>
          <div className="ingredient-network-details-status">
            <span className={`ingredient-network-status ingredient-network-status--${selectedNode.status}`}>
              {selectedNode.status === 'works' && '✅ Works for you'}
              {selectedNode.status === 'avoid' && '⛔ Avoid'}
              {selectedNode.status === 'suspect' && '⚠️ Possible trigger'}
              {selectedNode.status === 'neutral' && '⚪ Neutral'}
            </span>
          </div>
          <div className="ingredient-network-details-connections">
            <h4>Connections:</h4>
            <div className="ingredient-network-connections-list">
              {graphData.links
                .filter(link => link.source === selectedNode.id || link.target === selectedNode.id)
                .map((link, idx) => {
                  const connectedId = link.source === selectedNode.id ? link.target : link.source
                  const connectedNode = graphData.nodes.find(n => n.id === connectedId)
                  return (
                    <div key={idx} className="ingredient-network-connection-item">
                      <span className="ingredient-network-connection-name">{connectedNode?.name}</span>
                      <span className={`ingredient-network-connection-type ingredient-network-connection-type--${link.type}`}>
                        {link.type === 'conflict' ? '⚠️ Conflict' : '✅ Compatible'}
                      </span>
                    </div>
                  )
                })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatedCard>
  )
}

export default IngredientNetworkGraph

