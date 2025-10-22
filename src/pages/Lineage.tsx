import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactFlow, { Node, Edge, Background, Controls, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';
import { usePlantStore } from '@/stores/plantStore';
import { Plant } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Trash2, Move, Lock, Unlock } from 'lucide-react';
import { EditPlantModal } from '@/components/plants/EditPlantModal';
import { MovePlantModal } from '@/components/plants/MovePlantModal';
import { ConfirmDeleteModal } from '@/components/plants/ConfirmDeleteModal';

const Lineage = () => {
  const navigate = useNavigate();
  const { plants, fetchPlants } = usePlantStore();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedFamily, setSelectedFamily] = useState<number | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editingPlant, setEditingPlant] = useState<Plant | null>(null);
  const [movingPlant, setMovingPlant] = useState<Plant | null>(null);
  const [deletingPlant, setDeletingPlant] = useState<Plant | null>(null);

  interface TreeNode {
    plant: Plant;
    children: TreeNode[];
  }

  const buildTree = useCallback((plantId: number): TreeNode | null => {
    const plant = plants.find((p) => p.id === plantId);
    if (!plant) return null;

    const children = plants
      .filter((p) => p.maeId === plantId)
      .map((child) => buildTree(child.id!))
      .filter((node): node is TreeNode => node !== null);

    return { plant, children };
  }, [plants]);

  const createNodeLabel = (plant: Plant) => {
    return (
      <div className="p-3 min-w-[220px]">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className="text-xs">G{plant.geracao}</Badge>
          <Badge variant="secondary" className="text-xs">{plant.faseAtual}</Badge>
        </div>
        <div className="font-semibold text-base mb-1">{plant.apelido}</div>
        <div className="text-sm text-muted-foreground mb-2">🌱 {plant.especie}</div>
        <div className="text-xs text-muted-foreground mb-2">{plant.codigo}</div>
        {plant.genetica && (
          <div className="flex gap-1 text-xs mb-3">
            {plant.genetica.indica > 0 && <span>🟣 {plant.genetica.indica}%</span>}
            {plant.genetica.sativa > 0 && <span>🟢 {plant.genetica.sativa}%</span>}
            {plant.genetica.ruderalis > 0 && <span>🟡 {plant.genetica.ruderalis}%</span>}
          </div>
        )}
        {editMode && (
          <div className="flex gap-1 mt-2 pt-2 border-t border-border">
            <Button size="sm" variant="outline" className="h-7 text-xs flex-1" onClick={() => setEditingPlant(plant)}><Edit className="h-3 w-3 mr-1" />Editar</Button>
            <Button size="sm" variant="outline" className="h-7 text-xs flex-1" onClick={() => setMovingPlant(plant)}><Move className="h-3 w-3 mr-1" />Mover</Button>
            <Button size="sm" variant="destructive" className="h-7 text-xs" onClick={() => setDeletingPlant(plant)}><Trash2 className="h-3 w-3" /></Button>
          </div>
        )}
      </div>
    );
  };

  const treeToNodesAndEdges = useCallback((tree: TreeNode, x = 0, y = 0, level = 0): { nodes: Node[]; edges: Edge[] } => {
    const node: Node = {
      id: tree.plant.id!.toString(),
      type: 'default',
      position: { x, y },
      data: { label: createNodeLabel(tree.plant) },
      style: {
        background: editMode ? 'hsl(var(--warning) / 0.1)' : 'hsl(var(--card))',
        border: editMode ? '2px solid hsl(var(--warning))' : '2px solid hsl(var(--primary))',
        borderRadius: '8px',
        padding: 0,
      },
    };

    const nodes: Node[] = [node];
    const edges: Edge[] = [];

    if (tree.children.length > 0) {
      const horizontalSpacing = 300;
      const verticalSpacing = 200;
      const totalWidth = (tree.children.length - 1) * horizontalSpacing;
      const startX = x - totalWidth / 2;

      tree.children.forEach((child, index) => {
        const childX = startX + index * horizontalSpacing;
        const childY = y + verticalSpacing;
        const childResult = treeToNodesAndEdges(child, childX, childY, level + 1);
        nodes.push(...childResult.nodes);
        edges.push(...childResult.edges, {
          id: `${tree.plant.id}-${child.plant.id}`,
          source: tree.plant.id!.toString(),
          target: child.plant.id!.toString(),
          type: 'smoothstep',
          animated: true,
          style: { stroke: 'hsl(var(--primary))' },
        });
      });
    }

    return { nodes, edges };
  }, [editMode]);

  useEffect(() => {
    fetchPlants();
  }, [fetchPlants]);

  useEffect(() => {
    if (plants.length === 0) return;

    if (selectedFamily) {
      const familyTree = buildTree(selectedFamily);
      if (familyTree) {
        const { nodes: familyNodes, edges: familyEdges } = treeToNodesAndEdges(familyTree);
        setNodes(familyNodes);
        setEdges(familyEdges);
      }
    } else {
      const rootPlants = plants.filter((p) => !p.maeId);
      const allNodes: Node[] = [];
      const allEdges: Edge[] = [];
      
      rootPlants.forEach((rootPlant, index) => {
        const tree = buildTree(rootPlant.id!);
        if (tree) {
          const { nodes: familyNodes, edges: familyEdges } = treeToNodesAndEdges(tree, index * 500, 0, 0);
          allNodes.push(...familyNodes);
          allEdges.push(...familyEdges);
        }
      });

      setNodes(allNodes);
      setEdges(allEdges);
    }
  }, [plants, selectedFamily, buildTree, treeToNodesAndEdges]);

  const rootPlants = plants.filter((p) => !p.maeId);

  return (
    <div className="h-screen flex flex-col">
      <div className="p-4 bg-card border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate(-1)}><ArrowLeft className="h-4 w-4" /></Button>
            <h1 className="text-3xl font-bold">Árvore Genealógica</h1>
          </div>
          <Button variant={editMode ? "default" : "outline"} onClick={() => setEditMode(!editMode)} className="gap-2">
            {editMode ? <><Lock className="h-4 w-4" />Modo Edição Ativo</> : <><Unlock className="h-4 w-4" />Ativar Edição</>}
          </Button>
        </div>
        {editMode && (
          <div className="mt-4 p-3 rounded-lg bg-warning/10 border border-warning">
            <p className="text-sm font-medium">⚠️ Modo de edição ativo - Clique nos botões das plantas para editar, mover ou excluir</p>
          </div>
        )}
        <div className="flex gap-2 mt-4">
          <Button variant={selectedFamily === null ? "default" : "outline"} onClick={() => setSelectedFamily(null)}>Todas as Famílias</Button>
          {rootPlants.map((plant) => (
            <Button key={plant.id} variant={selectedFamily === plant.id ? "default" : "outline"} onClick={() => setSelectedFamily(plant.id!)}>
              {plant.apelido} ({plant.codigo})
            </Button>
          ))}
        </div>
      </div>
      <div className="flex-1">
        {nodes.length === 0 ? (
          <div className="flex items-center justify-center h-full"><p className="text-muted-foreground">Nenhuma planta cadastrada</p></div>
        ) : (
          <ReactFlow nodes={nodes} edges={edges} fitView minZoom={0.1} maxZoom={1.5}>
            <Background />
            <Controls />
            <MiniMap />
          </ReactFlow>
        )}
      </div>
      {editingPlant && <EditPlantModal plant={editingPlant} open={!!editingPlant} onOpenChange={(open) => !open && setEditingPlant(null)} onSuccess={fetchPlants} />}
      {movingPlant && <MovePlantModal plant={movingPlant} open={!!movingPlant} onOpenChange={(open) => !open && setMovingPlant(null)} onSuccess={fetchPlants} />}
      {deletingPlant && <ConfirmDeleteModal plant={deletingPlant} open={!!deletingPlant} onOpenChange={(open) => !open && setDeletingPlant(null)} onSuccess={fetchPlants} />}
    </div>
  );
};

export default Lineage;
