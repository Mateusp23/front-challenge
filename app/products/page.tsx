"use client";

import React, { useEffect, useMemo, useState } from "react";
import { 
  Card, 
  CardBody, 
  Input, 
  Button, 
  Spinner,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Image,
  Chip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure
} from "@heroui/react";
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  MoreVertical,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import { Header } from "../../components/Header";
import { useAuthGuard } from "../../hooks/useAuthGuard";
import { useProducts } from "../../hooks/useProducts";
import { Product } from "../../types/product";
import { ProductCreateModal } from "../../components/ProductCreateModal";
import { ProductEditModal } from "../../components/ProductEditModal";

export default function ProductsPage() {
  const { isLoading: authLoading, shouldRender } = useAuthGuard();
  const {
    products,
    loading,
    error,
    filters,
    refresh,
    search,
    changePage,
    remove,
    clearError,
    hasProducts,
    totalPages,
    currentPage,
  } = useProducts();

  const [searchTerm, setSearchTerm] = useState(filters.filter || '');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Product;
    direction: 'asc' | 'desc';
  } | null>(null);
  
  // Modais
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  
  // Produto selecionado para edição/exclusão
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Produtos ordenados
  const sortedProducts = useMemo(() => {
    if (!sortConfig) return products;
    
    return [...products].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue === undefined && bValue === undefined) return 0;
      if (aValue === undefined) return 1;
      if (bValue === undefined) return -1;
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [products, sortConfig]);

  // Limpar erro quando houver
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!shouldRender) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Redirecionando...</div>
      </div>
    );
  }

  const handleSearch = () => {
    search({ filter: searchTerm.trim() });
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    search({ filter: '' });
  };

  const handleSort = (key: keyof Product) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };


  const handleDelete = async () => {
    if (!selectedProduct) return;
    
    const result = await remove(selectedProduct.id);
    if (result.success) {
      toast.success('Produto excluído com sucesso!');
      onDeleteClose();
      setSelectedProduct(null);
    } else {
      toast.error(result.error || 'Erro ao excluir produto');
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    onEditOpen();
  };

  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product);
    onDeleteOpen();
  };

  return (
    <>
      <Header />
      
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Cabeçalho */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Produtos</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Gerencie seus produtos
              </p>
            </div>
            <Button
              color="primary"
              startContent={<Plus size={20} />}
              onPress={onCreateOpen}
            >
              Novo Produto
            </Button>
          </div>

          {/* Filtros e busca */}
          <Card>
            <CardBody>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <Input
                    label="Buscar produtos"
                    placeholder="Digite o título do produto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleSearchKeyPress}
                    startContent={<Search size={20} />}
                    isClearable
                    onClear={handleClearSearch}
                  />
                </div>
                <Button
                  color="primary"
                  variant="flat"
                  onPress={handleSearch}
                  isLoading={loading}
                >
                  Buscar
                </Button>
                <Button
                  color="default"
                  variant="flat"
                  onPress={refresh}
                  isLoading={loading}
                  isIconOnly
                >
                  <RefreshCw size={20} />
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* Tabela de produtos */}
          <Card>
            <CardBody className="p-0">
              {loading && !hasProducts ? (
                <div className="flex justify-center py-12">
                  <Spinner size="lg" />
                </div>
              ) : !hasProducts ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Nenhum produto encontrado</p>
                  <Button
                    color="primary"
                    variant="flat"
                    className="mt-4"
                    startContent={<Plus size={20} />}
                    onPress={onCreateOpen}
                  >
                    Criar primeiro produto
                  </Button>
                </div>
              ) : (
                <>
                  <Table 
                    aria-label="Tabela de produtos"
                    classNames={{
                      wrapper: "min-h-[400px]",
                    }}
                  >
                    <TableHeader>
                      <TableColumn key="thumbnail" width={80}>IMAGEM</TableColumn>
                      <TableColumn 
                        key="title" 
                        allowsSorting
                        onClick={() => handleSort('title')}
                        className="cursor-pointer"
                      >
                        TÍTULO
                        {sortConfig?.key === 'title' && (
                          <span className="ml-1">
                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </TableColumn>
                      <TableColumn key="description">DESCRIÇÃO</TableColumn>
                      <TableColumn 
                        key="status"
                        allowsSorting
                        onClick={() => handleSort('status')}
                        className="cursor-pointer"
                      >
                        STATUS
                        {sortConfig?.key === 'status' && (
                          <span className="ml-1">
                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </TableColumn>
                      <TableColumn 
                        key="updatedAt"
                        allowsSorting
                        onClick={() => handleSort('updatedAt')}
                        className="cursor-pointer"
                      >
                        ATUALIZADO
                        {sortConfig?.key === 'updatedAt' && (
                          <span className="ml-1">
                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </TableColumn>
                      <TableColumn key="actions" width={60}>AÇÕES</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {sortedProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <Image
                              src={product.thumbnail}
                              alt={product.title}
                              width={50}
                              height={50}
                              className="object-cover rounded-md"
                              fallbackSrc="/placeholder-image.png"
                            />
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{product.title}</div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-xs truncate">
                              {product.description}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Chip
                              color={product.status ? "success" : "warning"}
                              variant="flat"
                              size="sm"
                            >
                              {product.status ? "Ativo" : "Inativo"}
                            </Chip>
                          </TableCell>
                          <TableCell>
                            {new Date(product.updatedAt).toLocaleDateString('pt-BR')}
                          </TableCell>
                          <TableCell>
                            <Dropdown>
                              <DropdownTrigger>
                                <Button
                                  isIconOnly
                                  size="sm"
                                  variant="light"
                                >
                                  <MoreVertical size={16} />
                                </Button>
                              </DropdownTrigger>
                              <DropdownMenu>
                                <DropdownItem
                                  key="edit"
                                  startContent={<Edit size={16} />}
                                  onPress={() => handleEdit(product)}
                                >
                                  Editar
                                </DropdownItem>
                                <DropdownItem
                                  key="delete"
                                  startContent={<Trash2 size={16} />}
                                  className="text-danger"
                                  color="danger"
                                  onPress={() => handleDeleteClick(product)}
                                >
                                  Excluir
                                </DropdownItem>
                              </DropdownMenu>
                            </Dropdown>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* Paginação */}
                  {totalPages > 1 && (
                    <div className="flex justify-center py-4">
                      <Pagination
                        total={totalPages}
                        page={currentPage}
                        onChange={changePage}
                        showControls
                        showShadow
                        color="primary"
                      />
                    </div>
                  )}
                </>
              )}
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Modal de confirmação de exclusão */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalContent>
          <ModalHeader>Confirmar Exclusão</ModalHeader>
          <ModalBody>
            <p>
              Tem certeza que deseja excluir o produto{' '}
              <strong>{selectedProduct?.title}</strong>?
            </p>
            <p className="text-sm text-gray-500">
              Esta ação não pode ser desfeita.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="default"
              variant="light"
              onPress={onDeleteClose}
            >
              Cancelar
            </Button>
            <Button
              color="danger"
              onPress={handleDelete}
              isLoading={loading}
            >
              Excluir
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal de criação */}
      <ProductCreateModal
        isOpen={isCreateOpen}
        onClose={onCreateClose}
      />

      {/* Modal de edição */}
      <ProductEditModal
        isOpen={isEditOpen}
        onClose={onEditClose}
        product={selectedProduct}
      />
    </>
  );
}
