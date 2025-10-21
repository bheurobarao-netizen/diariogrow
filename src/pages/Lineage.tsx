import { useEffect, useState, useCallback } from 'react';
import { usePlantStore } from '@/stores/plantStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useNavigate } from 'react-router-dom';
import { Plant } from '@/lib/db';
import { getPhaseLabel } from '@/lib/phases';
import { Sprout } from 'lucide-react';

interface TreeNode {
  plant: Plant;
  children: TreeNode[];
}

const Lineage = () => {
  const navigate = useNavigate();
  const { plants, fetchPlants } = usePlantStore();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedFamily, setSelectedFamily] = useState<number | null>(null);

  useEffect(() => {
    fetchPlants();
  }, [fetchPlants]);

  const buildTree = useCallback(
    (plantId: number): TreeNode | null => {
      const plant = plants.find((p) => p.id === plantId);
      if (!plant) return null;

      const children = plants
        .filter((p) => p.maeId === plantId)
        .map((child) => buildTree(child.id!))
        .filter((node): node is TreeNode => node !== null);

      return { plant, children };
    },
    [plants]
  );

  const treeToNodesAndEdges = useCallback(
    (tree: TreeNode, x: number = 0, y: number = 0, level: number = 0): { nodes: Node[]; edges: Edge[] } => {
      const nodeWidth = 200;
      const nodeHeight = 120;
      const horizontalSpacing = 250;
      const verticalSpacing = 180;

      const currentNode: Node = {
        id: tree.plant.id!.toString(),
        type: 'default',
        position: { x, y },
        data: {
          label: (
            <div
              className="p-3 rounded-lg bg-card border-2 border-primary/20 hover:border-primary cursor-pointer transition-all"
              onClick={() => navigate(`/plants/${tree.plant.id}`)}
              style={{ width: nodeWidth }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Sprout className="w-4 h-4 text-primary" />
                <Badge variant="outline" className="text-xs">
                  {tree.plant.codigo}
                </Badge>
              </div>
              <h3 className="font-semibold text-sm mb-1 truncate">{tree.plant.apelido}</h3>
              <p className="text-xs text-muted-foreground truncate mb-1">{tree.plant.especie}</p>
              {tree.plant.faseAtual && (
                <Badge variant="secondary" className="text-xs">
                  {getPhaseLabel(tree.plant.faseAtual)}
                </Badge>
              )}
              <div className="text-xs text-muted-foreground mt-1">Geração {tree.plant.geracao}</div>
            </div>
          ),
        },
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
      };

      let allNodes: Node[] = [currentNode];
      let allEdges: Edge[] = [];

      if (tree.children.length > 0) {
        const totalChildrenWidth = tree.children.length * horizontalSpacing;
        const startX = x - totalChildrenWidth / 2 + horizontalSpacing / 2;

        tree.children.forEach((child, index) => {
          const childX = startX + index * horizontalSpacing;
          const childY = y + verticalSpacing;

          const { nodes: childNodes, edges: childEdges } = treeToNodesAndEdges(
            child,
            childX,
            childY,
            level + 1
          );

          allNodes = [...allNodes, ...childNodes];
          allEdges = [
            ...allEdges,
            {
              id: `${tree.plant.id}-${child.plant.id}`,
              source: tree.plant.id!.toString(),
              target: child.plant.id!.toString(),
              type: 'smoothstep',
              animated: true,
              style: { stroke: 'hsl(var(--primary))', strokeWidth: 2 },
            },
            ...childEdges,
          ];
        });
      }

      return { nodes: allNodes, edges: allEdges };
    },
    [navigate]
  );

  useEffect(() => {
    const rootPlants = plants.filter((p) => p.origem === 'semente');
    
    if (rootPlants.length === 0) {
      setNodes([]);
      setEdges([]);
      return;
    }

    if (selectedFamily !== null) {
      const tree = buildTree(selectedFamily);
      if (tree) {
        const { nodes: flowNodes, edges: flowEdges } = treeToNodesAndEdges(tree, 400, 50);
        setNodes(flowNodes);
        setEdges(flowEdges);
      }
    } else {
      // Show all families side by side
      let allNodes: Node[] = [];
      let allEdges: Edge[] = [];
      let xOffset = 100;

      rootPlants.forEach((root, index) => {
        const tree = buildTree(root.id!);
        if (tree) {
          const { nodes: flowNodes, edges: flowEdges } = treeToNodesAndEdges(tree, xOffset, 50);
          allNodes = [...allNodes, ...flowNodes];
          allEdges = [...allEdges, ...flowEdges];
          xOffset += 600; // Space between families
        }
      });

      setNodes(allNodes);
      setEdges(allEdges);
    }
  }, [plants, buildTree, treeToNodesAndEdges, setNodes, setEdges, selectedFamily]);

  const rootPlants = plants.filter((p) => p.origem === 'semente');

  return (
    <div className="h-screen flex flex-col">
      <div className="p-4 bg-card border-b">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-primary flex items-center gap-2 mb-4">
            <Sprout className="w-8 h-8" />
            Árvore Genealógica
          </h1>
          
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedFamily === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFamily(null)}
            >
              Todas as Famílias
            </Button>
            {rootPlants.map((root) => (
              <Button
                key={root.id}
                variant={selectedFamily === root.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFamily(root.id!)}
              >
                {root.apelido} ({root.codigo})
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1">
        {nodes.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <Card className="p-12 text-center max-w-md">
              <Sprout className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Nenhuma linhagem ainda</h2>
              <p className="text-muted-foreground">
                Cadastre plantas mães para começar a visualizar a árvore genealógica
              </p>
            </Card>
          </div>
        ) : (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            fitView
            minZoom={0.1}
            maxZoom={1.5}
          >
            <Background />
            <Controls />
            <MiniMap
              nodeColor={(node) => 'hsl(var(--primary))'}
              maskColor="rgb(0, 0, 0, 0.1)"
            />
          </ReactFlow>
        )}
      </div>
    </div>
  );
};

export default Lineage;
