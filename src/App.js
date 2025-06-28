import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function App() {
  // Adicionar estilos CSS para animações
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
      
      @keyframes scaleIn {
        from {
          opacity: 0;
          transform: scale(0.8);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
      
      /* Responsividade Mobile */
      @media (max-width: 768px) {
        .mobile-responsive {
          padding: 10px !important;
          margin: 10px !important;
        }
        
        .mobile-text-small {
          font-size: 14px !important;
        }
        
        .mobile-text-medium {
          font-size: 18px !important;
        }
        
        .mobile-text-large {
          font-size: 24px !important;
        }
        
        .mobile-grid {
          grid-template-columns: 1fr !important;
          gap: 15px !important;
        }
        
        .mobile-hide {
          display: none !important;
        }
        
        .mobile-full-width {
          width: 100% !important;
          max-width: 100% !important;
        }
        
        .mobile-center {
          text-align: center !important;
        }
        
        .mobile-padding {
          padding: 15px !important;
        }
        
        .mobile-margin {
          margin: 10px 0 !important;
        }
      }
      
      @media (max-width: 480px) {
        .mobile-small-responsive {
          padding: 8px !important;
          margin: 8px !important;
        }
        
        .mobile-small-text {
          font-size: 12px !important;
        }
        
        .mobile-small-grid {
          grid-template-columns: 1fr !important;
          gap: 10px !important;
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const tools = [
    { name: 'Illustrator', icon: '/images/illustrador.png' },
    { name: 'Photoshop', icon: '/images/photoshop.png' },
    { name: 'After Effects', icon: '/images/after.png' },
    { name: 'XD', icon: '/images/xd.png' },
    { name: 'InDesign', icon: '/images/indesign.png' },
    { name: 'HTML', icon: '/images/html.png' },
    { name: 'CSS', icon: '/images/css.png' },
    { name: 'JavaScript', icon: '/images/js.png' },
    { name: 'React', icon: '/images/react.png' }
  ];

  const [showEditMenu, setShowEditMenu] = React.useState(false);
  const [coverImage, setCoverImage] = React.useState('/images/nova.png');
  const [coverPosition, setCoverPosition] = React.useState('center');
  const [showAdjustMenu, setShowAdjustMenu] = React.useState(false);
  const [isHoveringCover, setIsHoveringCover] = React.useState(false);
  const [isHoveringProfilePic, setIsHoveringProfilePic] = React.useState(false);
  const [showProfileEditMenu, setShowProfileEditMenu] = React.useState(false);
  const [profileImage, setProfileImage] = React.useState('/images/foto.jpg');
  const [showProfilePreview, setShowProfilePreview] = React.useState(false);
  const [isManualAdjustMode, setIsManualAdjustMode] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });
  const [coverOffset, setCoverOffset] = React.useState({ x: 0, y: 0 });
  const [userName, setUserName] = React.useState('Sheila Rodgez');
  const [isEditingName, setIsEditingName] = React.useState(false);
  const [isHoveringName, setIsHoveringName] = React.useState(false);
  const [userBio, setUserBio] = React.useState('" Tem gente que está do mesmo lado que você, mas deveria estar do lado de lá."');
  const [isEditingBio, setIsEditingBio] = React.useState(false);
  const [isHoveringBio, setIsHoveringBio] = React.useState(false);
  const [isDarkTheme, setIsDarkTheme] = React.useState(false);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  const exportToPDF = async () => {
    try {
      // Criar um elemento temporário para capturar apenas o conteúdo do perfil
      const element = document.querySelector('.profile-container') || document.body;
      
      // Configurações para html2canvas
      const canvas = await html2canvas(element, {
        scale: 2, // Maior qualidade
        useCORS: true,
        allowTaint: true,
        backgroundColor: isDarkTheme ? '#1a202c' : '#ffffff',
        width: element.scrollWidth,
        height: element.scrollHeight
      });
      
      // Criar PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Calcular dimensões para ajustar à página
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      
      let position = 0;
      
      // Adicionar primeira página
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      // Adicionar páginas adicionais se necessário
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      // Salvar o PDF
      pdf.save(`${userName.replace(/\s+/g, '_')}_Perfil.pdf`);
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF. Tente novamente.');
    }
  };

  const handleEditCover = (action) => {
    if (action === 'adjust') {
      setShowAdjustMenu(true);
    } else if (action === 'change') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setCoverImage(e.target.result);
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    }
    setShowEditMenu(false);
  };

  const handlePositionChange = (position) => {
    setCoverPosition(position);
    setShowAdjustMenu(false);
    setShowEditMenu(false);
  };

  const handleManualAdjust = () => {
    setIsManualAdjustMode(true);
    setShowAdjustMenu(false);
    setShowEditMenu(false);
  };

  const handleMouseDown = (e) => {
    if (isManualAdjustMode) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      e.preventDefault();
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && isManualAdjustMode) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      setCoverOffset({ x: deltaX, y: deltaY });
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  const exitManualAdjust = () => {
    setIsManualAdjustMode(false);
    setIsDragging(false);
    setCoverOffset({ x: 0, y: 0 });
  };

  const confirmManualAdjust = () => {
    // Converter o offset em uma posição CSS personalizada
    // Calcular a nova posição baseada no movimento
    const containerWidth = window.innerWidth;
    const containerHeight = 300; // altura da capa
    
    // Converter pixels para porcentagem (invertendo a direção para ficar natural)
     const moveX = -(coverOffset.x / containerWidth) * 100;
     const moveY = -(coverOffset.y / containerHeight) * 100;
    
    // Obter posição atual ou usar centro como padrão
    let currentX = 50; // centro padrão
    let currentY = 50; // centro padrão
    
    // Se já existe uma posição personalizada, extrair os valores
    if (coverPosition.includes('%')) {
      const parts = coverPosition.split(' ');
      currentX = parseFloat(parts[0]) || 50;
      currentY = parseFloat(parts[1]) || 50;
    }
    
    // Aplicar o movimento à posição atual
    const newX = Math.max(0, Math.min(100, currentX + moveX));
    const newY = Math.max(0, Math.min(100, currentY + moveY));
    
    setCoverPosition(`${newX}% ${newY}%`);
    exitManualAdjust();
  };

  const handleEditProfile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setProfileImage(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
    setShowProfileEditMenu(false);
  };

  const handleViewProfile = () => {
    setShowProfilePreview(true);
    setShowProfileEditMenu(false);
  };

  const closeProfilePreview = () => {
    setShowProfilePreview(false);
  };

  const handleEditName = () => {
    setIsEditingName(true);
  };

  const handleNameChange = (e) => {
    if (e.key === 'Enter') {
      setIsEditingName(false);
    } else if (e.key === 'Escape') {
      setUserName('Nome do Usuário'); // volta ao valor original
      setIsEditingName(false);
    }
  };

  const handleNameBlur = () => {
    setIsEditingName(false);
  };

  const handleEditBio = () => {
    setIsEditingBio(true);
  };

  const handleBioChange = (e) => {
    if (e.key === 'Enter') {
      setIsEditingBio(false);
    } else if (e.key === 'Escape') {
      setUserBio('Descrição do perfil ou biografia aqui.'); // volta ao valor original
      setIsEditingBio(false);
    }
  };

  const handleBioBlur = () => {
    setIsEditingBio(false);
  };

  // Fechar menus ao clicar fora
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.edit-menu-container') && !event.target.closest('.profile-edit-container')) {
        setShowEditMenu(false);
        setShowAdjustMenu(false);
        setShowProfileEditMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Event listeners para arrastar manual
  React.useEffect(() => {
    if (isManualAdjustMode) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isManualAdjustMode, isDragging, dragStart, coverOffset]);

  // Fechar menus quando sair da capa ou entrar na foto de perfil
  React.useEffect(() => {
    if (!isHoveringCover || isHoveringProfilePic) {
      setShowEditMenu(false);
      setShowAdjustMenu(false);
    }
  }, [isHoveringCover, isHoveringProfilePic]);

  // Listener para redimensionamento da janela (responsividade dinâmica)
  React.useEffect(() => {
    const handleResize = () => {
      // Força re-render quando a janela é redimensionada
      setUserName(prev => prev);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div>
      {/* Capa do perfil */}
      <div 
        className="mobile-full-width"
        onMouseEnter={() => setIsHoveringCover(true)}
        onMouseLeave={() => setIsHoveringCover(false)}
        onMouseDown={handleMouseDown}
        style={{
          backgroundImage: `url(${coverImage})`,
          backgroundSize: 'cover',
          backgroundPosition: isManualAdjustMode ? `calc(${coverPosition.includes('%') ? coverPosition.split(' ')[0] : '50%'} + ${coverOffset.x}px) calc(${coverPosition.includes('%') ? coverPosition.split(' ')[1] || '50%' : '50%'} + ${coverOffset.y}px)` : coverPosition,
          height: window.innerWidth <= 768 ? '200px' : '300px',
          width: '100%',
          position: 'relative',
          cursor: isManualAdjustMode ? (isDragging ? 'grabbing' : 'grab') : 'default',
          userSelect: isManualAdjustMode ? 'none' : 'auto',
          border: isManualAdjustMode ? '3px solid #007bff' : 'none',
          boxSizing: 'border-box'
        }}>
        {/* Controles do modo manual */}
        {isManualAdjustMode && (
          <div style={{
            position: 'absolute',
            top: '15px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 15,
            display: 'flex',
            gap: '10px',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: '10px 15px',
            borderRadius: '25px',
            color: 'white'
          }}>
            <span style={{ fontSize: '14px', marginRight: '10px' }}>🎯 Arraste para ajustar</span>
            <button
              onClick={confirmManualAdjust}
              style={{
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '15px',
                padding: '5px 12px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                animation: 'bounceIn 0.5s ease-out'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#218838';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#28a745';
                e.target.style.transform = 'scale(1)';
              }}
            >
              ✓ Confirmar
            </button>
            <button
              onClick={exitManualAdjust}
              style={{
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '15px',
                padding: '5px 12px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                animation: 'bounceIn 0.5s ease-out 0.1s'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#c82333';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#dc3545';
                e.target.style.transform = 'scale(1)';
              }}
            >
              ✕ Cancelar
            </button>
          </div>
        )}

        {/* Botão de editar capa */}
        <div className="edit-menu-container" style={{
          position: 'absolute',
          top: '15px',
          right: '15px',
          zIndex: 10,
          opacity: (isHoveringCover && !isHoveringProfilePic && !isManualAdjustMode) ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out',
          pointerEvents: (isHoveringCover && !isHoveringProfilePic && !isManualAdjustMode) ? 'auto' : 'none'
        }}>
          <button 
            onClick={() => setShowEditMenu(!showEditMenu)}
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              padding: '8px 8px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            ✏️
          </button>
          
          {/* Menu dropdown */}
          {showEditMenu && (
            <div style={{
              position: 'absolute',
              top: '40px',
              right: '0',
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              minWidth: '140px',
              overflow: 'hidden'
            }}>
              <button 
                onClick={() => handleEditCover('adjust')}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '14px',
                  borderBottom: '1px solid #eee'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                🔧 Ajustar Capa
              </button>
              <button 
                onClick={() => handleEditCover('change')}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                🖼️ Trocar Capa
              </button>
            </div>
          )}
          
          {/* Menu de ajuste de posição */}
          {showAdjustMenu && (
            <div style={{
              position: 'absolute',
              top: '40px',
              right: '0',
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              minWidth: '180px',
              overflow: 'hidden'
            }}>
              <div style={{
                padding: '8px 16px',
                backgroundColor: '#f8f9fa',
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#666',
                borderBottom: '1px solid #eee'
              }}>
                Posição da Capa
              </div>
              <button 
                onClick={handleManualAdjust}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '13px',
                  borderBottom: '1px solid #eee',
                  fontWeight: 'bold',
                  color: '#007bff'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#f0f8ff'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                🎯 Ajustar Manualmente
              </button>
              {[
                { label: '📍 Centro', value: 'center' },
                { label: '⬆️ Topo', value: 'top' },
                { label: '⬇️ Base', value: 'bottom' },
                { label: '⬅️ Esquerda', value: 'left' },
                { label: '➡️ Direita', value: 'right' },
                { label: '↖️ Topo Esquerda', value: 'top left' },
                { label: '↗️ Topo Direita', value: 'top right' },
                { label: '↙️ Base Esquerda', value: 'bottom left' },
                { label: '↘️ Base Direita', value: 'bottom right' }
              ].map((position, index) => (
                <button 
                  key={index}
                  onClick={() => handlePositionChange(position.value)}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    border: 'none',
                    backgroundColor: coverPosition === position.value ? '#e3f2fd' : 'transparent',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '13px',
                    borderBottom: index < 8 ? '1px solid #eee' : 'none'
                  }}
                  onMouseOver={(e) => {
                    if (coverPosition !== position.value) {
                      e.target.style.backgroundColor = '#f5f5f5';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (coverPosition !== position.value) {
                      e.target.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {position.label}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Foto do perfil */}
        <div 
          className="profile-edit-container"
          onMouseEnter={() => setIsHoveringProfilePic(true)}
          onMouseLeave={() => setIsHoveringProfilePic(false)}
          style={{
            position: 'absolute',
            bottom: '-75px',
            left: '20px',
            width: '150px',
            height: '150px'
          }}
        >
          <img 
            src={profileImage}
            alt="Foto do Perfil"
            style={{
              borderRadius: '50%',
              border: '4px solid rgb(203, 167, 173)',
              height: '150px',
              width: '150px',
              objectFit: 'cover',
              display: 'block'
            }}
          />
          
          {/* Botão de editar foto de perfil */}
          {isHoveringProfilePic && (
            <div style={{
              position: 'absolute',
              top: '5px',
              right: '5px',
              zIndex: 15
            }}>
              <button 
                onClick={() => setShowProfileEditMenu(!showProfileEditMenu)}
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ✏️
              </button>
              
              {/* Menu dropdown da foto */}
              {showProfileEditMenu && (
                <div style={{
                   position: 'absolute',
                   top: '35px',
                   right: '0',
                   backgroundColor: 'white',
                   borderRadius: '6px',
                   boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                   minWidth: '95px',
                   overflow: 'hidden'
                 }}>
                  <button 
                      onClick={handleViewProfile}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: 'none',
                        backgroundColor: 'transparent',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontSize: '13px',
                        borderBottom: '1px solid #eee'
                      }}
                     onMouseOver={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                     onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                   >
                     Ver Foto
                   </button>
                   <button 
                      onClick={handleEditProfile}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: 'none',
                        backgroundColor: 'transparent',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontSize: '13px'
                      }}
                     onMouseOver={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                     onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                   >
                    Trocar Foto
                   </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Botão de alternância de tema */}
      <button
        onClick={toggleTheme}
        style={{
          position: 'fixed',
          top: window.innerWidth <= 768 ? '10px' : '20px',
          right: window.innerWidth <= 768 ? '10px' : '20px',
          zIndex: 1000,
          backgroundColor: isDarkTheme ? '#4a5568' : '#ffffff',
          color: isDarkTheme ? '#ffffff' : '#2d3748',
          border: 'none',
          borderRadius: '50px',
          padding: window.innerWidth <= 768 ? '8px 12px' : '12px 20px',
          cursor: 'pointer',
          fontSize: window.innerWidth <= 768 ? '12px' : '14px',
          fontWeight: '500',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          gap: window.innerWidth <= 768 ? '4px' : '8px'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        }}
      >
        {isDarkTheme ? '☀️' : '🌙'}
        {isDarkTheme ? 'Claro' : 'Escuro'}
      </button>
      
      {/* Botão de exportar PDF */}
      <button
        onClick={exportToPDF}
        style={{
          position: 'fixed',
          top: window.innerWidth <= 768 ? '10px' : '20px',
          right: window.innerWidth <= 768 ? '120px' : '150px',
          zIndex: 1000,
          backgroundColor: isDarkTheme ? '#4a5568' : '#ffffff',
          color: isDarkTheme ? '#ffffff' : '#2d3748',
          border: 'none',
          borderRadius: '50px',
          padding: window.innerWidth <= 768 ? '8px 12px' : '12px 20px',
          cursor: 'pointer',
          fontSize: window.innerWidth <= 768 ? '12px' : '14px',
          fontWeight: '500',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          gap: window.innerWidth <= 768 ? '4px' : '8px'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        }}
      >
        📄 Exportar PDF
      </button>

      {/* Conteúdo do perfil */}
      <div className="mobile-container profile-container" style={{
        padding: window.innerWidth <= 768 ? '20px 10px 10px' : '60px 20px 20px',
        background: isDarkTheme 
          ? 'linear-gradient(135deg, #2d3748 0%, #4a5568 100%)' 
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
        gap: window.innerWidth <= 768 ? '20px' : '40px',
        alignItems: 'flex-start'
      }}>
        {/* Coluna esquerda - Informações do perfil */}
        <div className="profile-info-container" style={{
          flex: '1',
          width: window.innerWidth <= 768 ? '100%' : 'auto',
          minWidth: window.innerWidth <= 768 ? '100%' : '300px',
          backgroundColor: isDarkTheme ? '#1a202c' : 'white',
          color: isDarkTheme ? '#e2e8f0' : '#2d3748',
          borderRadius: '20px',
          padding: window.innerWidth <= 768 ? '20px' : '30px',
          boxShadow: isDarkTheme 
            ? '0 10px 30px rgba(0, 0, 0, 0.3)' 
            : '0 10px 30px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease'
        }}>
          {/* Nome do usuário editável */}
          <div 
            style={{
              position: 'relative',
              display: 'inline-block',
              margin: '0 0 10px 0',
              paddingRight: '45px'
            }}
            onMouseEnter={() => setIsHoveringName(true)}
            onMouseLeave={() => setIsHoveringName(false)}
          >
            {isEditingName ? (
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                onKeyDown={handleNameChange}
                onBlur={handleNameBlur}
                autoFocus
                style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: isDarkTheme ? '#e2e8f0' : '#333',
                  border: '2px solid #007bff',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  backgroundColor: isDarkTheme ? '#2d3748' : 'white',
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
              />
            ) : (
              <h1 style={{margin: '0', color: isDarkTheme ? '#e2e8f0' : '#333', display: 'inline', fontFamily: '"Poppins", "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif', fontWeight: '600', letterSpacing: '-0.5px'}}>{userName}</h1>
            )}
            
            {/* Botão de editar nome */}
            {isHoveringName && !isEditingName && (
              <button
                onClick={handleEditName}
                style={{
                  position: 'absolute',
                  top: '0',
                  right: '10px',
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '25px',
                  height: '25px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  display: 'flex',
                  transition: 'all 0.3s ease',
                  animation: 'fadeIn 0.3s ease-out',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ✏️
              </button>
            )}
          </div>
          {/* Descrição do perfil editável */}
          <div 
              style={{
                position: 'relative',
                display: 'block',
                margin: '0 0 20px 0',
                width: '200%'
              }}
            onMouseEnter={() => setIsHoveringBio(true)}
            onMouseLeave={() => setIsHoveringBio(false)}
          >
            {isEditingBio ? (
              <textarea
                 value={userBio}
                 onChange={(e) => setUserBio(e.target.value)}
                 onKeyDown={handleBioChange}
                 onBlur={handleBioBlur}
                 autoFocus
                 style={{
                    width: '70%',
                    minHeight: '40px',
                    fontSize: '16px',
                    color: isDarkTheme ? '#cbd5e0' : '#666',
                    border: '2px solid #007bff',
                    borderRadius: '4px',
                    padding: '6px',
                    backgroundColor: isDarkTheme ? '#2d3748' : 'white',
                    outline: 'none',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
              />
            ) : (
               <p style={{margin: '0', color: isDarkTheme ? '#cbd5e0' : '#666', display: 'inline'}}>
                 {userBio}
                 {/* Botão de editar biografia */}
                 {isHoveringBio && !isEditingBio && (
                   <button
                     onClick={handleEditBio}
                     style={{
                       marginLeft: '8px',
                       backgroundColor: 'rgba(0, 0, 0, 0.6)',
                       color: 'white',
                       border: 'none',
                       borderRadius: '50%',
                       width: '20px',
                       height: '20px',
                       cursor: 'pointer',
                       fontSize: '10px',
                       display: 'inline-flex',
                       alignItems: 'center',
                       justifyContent: 'center',
                       verticalAlign: 'middle',
                       transition: 'all 0.3s ease',
                       animation: 'fadeIn 0.3s ease-out'
                     }}
                     onMouseEnter={(e) => {
                       e.target.style.backgroundColor = 'rgba(0, 123, 255, 0.8)';
                       e.target.style.transform = 'scale(1.1)';
                     }}
                     onMouseLeave={(e) => {
                       e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
                       e.target.style.transform = 'scale(1)';
                     }}
                   >
                     ✏️
                   </button>
                 )}
               </p>
             )}
          </div>
        </div>
        
        {/* Coluna direita - Seção de conquistas */}
        <div style={{
          flex: '1',
          minWidth: '300px',
          marginLeft: '40px',
          backgroundColor: isDarkTheme ? '#1a202c' : 'white',
          borderRadius: '20px',
          padding: '30px',
          boxShadow: isDarkTheme 
            ? '0 10px 30px rgba(0, 0, 0, 0.3)' 
            : '0 10px 30px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease'
        }}>
          <h2 style={{
            marginTop: '0',
            marginBottom: '25px',
            color: isDarkTheme ? '#e2e8f0' : '#2d3748',
            fontFamily: '"Poppins", "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
            fontWeight: '600',
            fontSize: '24px',
            textAlign: 'center',
            position: 'relative'
          }}>Minhas conquistas
            <div style={{
              position: 'absolute',
              bottom: '-8px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '60px',
              height: '3px',
              background: 'linear-gradient(90deg, #667eea, #764ba2)',
              borderRadius: '2px'
            }}></div>
          </h2>
          
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '5px',
            marginTop: '10px'
          }}>
        
          {tools.map((tool, index) => (
            <div key={index} style={{
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '60px',
              width: '60px',
              backgroundColor: isDarkTheme ? '#2d3748' : '#f8f9fa',
              boxShadow: isDarkTheme 
                ? '0 4px 12px rgba(0, 0, 0, 0.3)' 
                : '0 4px 12px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-5px)';
              e.target.style.boxShadow = isDarkTheme 
                ? '0 8px 25px rgba(0, 0, 0, 0.4)' 
                : '0 8px 25px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = isDarkTheme 
                ? '0 4px 12px rgba(0, 0, 0, 0.3)' 
                : '0 4px 12px rgba(0, 0, 0, 0.1)';
            }}>
              <img 
                src={tool.icon} 
                alt={tool.name}
                style={{
                  height: '40px',
                  width: '40px',
                  transition: 'transform 0.3s ease'
                }}
              />
            </div>
          ))}
           </div>
         </div>
      </div>

      {/* Seção de Projetos/Portfólio */}
      <div style={{
        padding: '60px 20px',
        background: isDarkTheme 
          ? 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)' 
          : 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
        minHeight: '100vh'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h2 style={{
            textAlign: 'center',
            marginBottom: window.innerWidth <= 768 ? '30px' : '50px',
            color: isDarkTheme ? '#e2e8f0' : '#2d3748',
            fontFamily: '"Poppins", "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
            fontWeight: '600',
            fontSize: window.innerWidth <= 768 ? '28px' : '36px',
            position: 'relative'
          }}>
            Meus Projetos
            <div style={{
              position: 'absolute',
              bottom: '-12px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '80px',
              height: '4px',
              background: 'linear-gradient(90deg, #667eea, #764ba2)',
              borderRadius: '2px'
            }}></div>
          </h2>

          <div className="projects-grid" style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: window.innerWidth <= 768 ? '20px' : '25px',
            marginTop: window.innerWidth <= 768 ? '20px' : '40px'
          }}>
            {/* Projeto 1 - Design UI/UX */}
            <div style={{
              backgroundColor: isDarkTheme ? '#1a202c' : 'white',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: isDarkTheme 
                ? '0 15px 35px rgba(0, 0, 0, 0.3)' 
                : '0 15px 35px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = isDarkTheme 
                ? '0 25px 50px rgba(0, 0, 0, 0.4)' 
                : '0 25px 50px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = isDarkTheme 
                ? '0 15px 35px rgba(0, 0, 0, 0.3)' 
                : '0 15px 35px rgba(0, 0, 0, 0.1)';
            }}>
              <div style={{
                height: '220px',
                backgroundImage: 'url(./images/xd.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0,
                  transition: 'opacity 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '0';
                }}>
                  <span style={{
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: '600',
                    textAlign: 'center'
                  }}>Ver Projeto</span>
                </div>
              </div>
              <div style={{
                padding: '25px'
              }}>
                <h3 style={{
                  margin: '0 0 15px 0',
                  color: isDarkTheme ? '#e2e8f0' : '#2d3748',
                  fontSize: '22px',
                  fontWeight: '600'
                }}>
                  Interface Adobe XD
                </h3>
                <p style={{
                  margin: '0 0 15px 0',
                  color: isDarkTheme ? '#cbd5e0' : '#666',
                  fontSize: '14px',
                  lineHeight: '1.6'
                }}>
                  Design de interface moderna e intuitiva criada no Adobe XD com foco na experiência do usuário. Projeto completo incluindo wireframes, protótipos interativos e guia de estilo.
                </p>
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  flexWrap: 'wrap',
                  marginBottom: '20px'
                }}>
                  {['Adobe XD', 'UI/UX', 'Prototyping'].map((tech, index) => (
                    <span key={index} style={{
                      backgroundColor: isDarkTheme ? '#2d3748' : '#f1f5f9',
                      color: isDarkTheme ? '#e2e8f0' : '#475569',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {tech}
                    </span>
                  ))}
                </div>
                <div style={{
                  display: 'flex',
                  gap: '10px',
                  flexWrap: 'wrap'
                }}>
                  <a 
                    href="https://github.com/usuario/projeto-xd" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      backgroundColor: isDarkTheme ? '#667eea' : '#667eea',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontSize: '13px',
                      fontWeight: '500',
                      transition: 'all 0.3s ease',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#5a67d8';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#667eea';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    📁 Ver Código
                  </a>
                  <a 
                    href="https://projeto-demo.netlify.app" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      backgroundColor: isDarkTheme ? '#48bb78' : '#48bb78',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontSize: '13px',
                      fontWeight: '500',
                      transition: 'all 0.3s ease',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#38a169';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#48bb78';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    🚀 Demo Live
                  </a>
                </div>
              </div>
            </div>

            {/* Projeto 2 - Desenvolvimento React */}
            <div style={{
              backgroundColor: isDarkTheme ? '#1a202c' : 'white',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: isDarkTheme 
                ? '0 15px 35px rgba(0, 0, 0, 0.3)' 
                : '0 15px 35px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = isDarkTheme 
                ? '0 25px 50px rgba(0, 0, 0, 0.4)' 
                : '0 25px 50px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = isDarkTheme 
                ? '0 15px 35px rgba(0, 0, 0, 0.3)' 
                : '0 15px 35px rgba(0, 0, 0, 0.1)';
            }}>
              <div style={{
                height: '220px',
                backgroundImage: 'url(./images/react.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, rgba(79, 172, 254, 0.8) 0%, rgba(0, 242, 254, 0.8) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0,
                  transition: 'opacity 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '0';
                }}>
                  <span style={{
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: '600',
                    textAlign: 'center'
                  }}>Ver Projeto</span>
                </div>
              </div>
              <div style={{
                padding: '25px'
              }}>
                <h3 style={{
                  margin: '0 0 15px 0',
                  color: isDarkTheme ? '#e2e8f0' : '#2d3748',
                  fontSize: '22px',
                  fontWeight: '600'
                }}>
                  Aplicação React
                </h3>
                <p style={{
                  margin: '0 0 15px 0',
                  color: isDarkTheme ? '#cbd5e0' : '#666',
                  fontSize: '14px',
                  lineHeight: '1.6'
                }}>
                  Desenvolvimento de aplicação web moderna utilizando React com componentes reutilizáveis e responsivos. Inclui gerenciamento de estado, roteamento e integração com APIs REST.
                </p>
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  flexWrap: 'wrap',
                  marginBottom: '20px'
                }}>
                  {['React', 'JavaScript', 'CSS3'].map((tech, index) => (
                    <span key={index} style={{
                      backgroundColor: isDarkTheme ? '#2d3748' : '#f1f5f9',
                      color: isDarkTheme ? '#e2e8f0' : '#475569',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {tech}
                    </span>
                  ))}
                </div>
                <div style={{
                  display: 'flex',
                  gap: '10px',
                  flexWrap: 'wrap'
                }}>
                  <a 
                    href="https://github.com/usuario/projeto-react" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      backgroundColor: isDarkTheme ? '#4facfe' : '#4facfe',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontSize: '13px',
                      fontWeight: '500',
                      transition: 'all 0.3s ease',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#3182ce';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#4facfe';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    📁 Ver Código
                  </a>
                  <a 
                    href="https://react-app-demo.vercel.app" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      backgroundColor: isDarkTheme ? '#00f2fe' : '#00f2fe',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontSize: '13px',
                      fontWeight: '500',
                      transition: 'all 0.3s ease',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#0bc5ea';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#00f2fe';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    🚀 Demo Live
                  </a>
                </div>
              </div>
            </div>

            {/* Projeto 3 - Design Photoshop */}
            <div style={{
              backgroundColor: isDarkTheme ? '#1a202c' : 'white',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: isDarkTheme 
                ? '0 15px 35px rgba(0, 0, 0, 0.3)' 
                : '0 15px 35px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = isDarkTheme 
                ? '0 25px 50px rgba(0, 0, 0, 0.4)' 
                : '0 25px 50px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = isDarkTheme 
                ? '0 15px 35px rgba(0, 0, 0, 0.3)' 
                : '0 15px 35px rgba(0, 0, 0, 0.1)';
            }}>
              <div style={{
                height: '220px',
                backgroundImage: 'url(./images/photoshop.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, rgba(250, 112, 154, 0.8) 0%, rgba(254, 225, 64, 0.8) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0,
                  transition: 'opacity 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '0';
                }}>
                  <span style={{
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: '600',
                    textAlign: 'center'
                  }}>Ver Projeto</span>
                </div>
              </div>
              <div style={{
                padding: '25px'
              }}>
                <h3 style={{
                  margin: '0 0 15px 0',
                  color: isDarkTheme ? '#e2e8f0' : '#2d3748',
                  fontSize: '22px',
                  fontWeight: '600'
                }}>
                  Arte Digital Photoshop
                </h3>
                <p style={{
                  margin: '0 0 15px 0',
                  color: isDarkTheme ? '#cbd5e0' : '#666',
                  fontSize: '14px',
                  lineHeight: '1.6'
                }}>
                  Criação de arte digital e manipulação de imagens utilizando técnicas avançadas do Photoshop. Inclui retoque fotográfico, montagens criativas e design gráfico.
                </p>
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  flexWrap: 'wrap',
                  marginBottom: '20px'
                }}>
                  {['Photoshop', 'Digital Art', 'Photo Editing'].map((tech, index) => (
                    <span key={index} style={{
                      backgroundColor: isDarkTheme ? '#2d3748' : '#f1f5f9',
                      color: isDarkTheme ? '#e2e8f0' : '#475569',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {tech}
                    </span>
                  ))}
                </div>
                <div style={{
                  display: 'flex',
                  gap: '10px',
                  flexWrap: 'wrap'
                }}>
                  <a 
                    href="https://behance.net/usuario/arte-digital" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      backgroundColor: isDarkTheme ? '#667eea' : '#667eea',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontSize: '13px',
                      fontWeight: '500',
                      transition: 'all 0.3s ease',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#5a67d8';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#667eea';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    🎨 Ver Portfolio
                  </a>
                  <a 
                    href="https://dribbble.com/usuario/arte-digital" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      backgroundColor: isDarkTheme ? '#f093fb' : '#f093fb',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontSize: '13px',
                      fontWeight: '500',
                      transition: 'all 0.3s ease',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#ed64a6';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#f093fb';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    ✨ Galeria
                  </a>
                </div>
              </div>
            </div>

            {/* Projeto 4 - Ilustração */}
            <div style={{
              backgroundColor: isDarkTheme ? '#1a202c' : 'white',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: isDarkTheme 
                ? '0 15px 35px rgba(0, 0, 0, 0.3)' 
                : '0 15px 35px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = isDarkTheme 
                ? '0 25px 50px rgba(0, 0, 0, 0.4)' 
                : '0 25px 50px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = isDarkTheme 
                ? '0 15px 35px rgba(0, 0, 0, 0.3)' 
                : '0 15px 35px rgba(0, 0, 0, 0.1)';
            }}>
              <div style={{
                height: '220px',
                backgroundImage: 'url(./images/illustrador.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, rgba(255, 94, 77, 0.8) 0%, rgba(255, 154, 0, 0.8) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0,
                  transition: 'opacity 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '0';
                }}>
                  <span style={{
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: '600',
                    textAlign: 'center'
                  }}>Ver Projeto</span>
                </div>
              </div>
              <div style={{
                padding: '25px'
              }}>
                <h3 style={{
                  margin: '0 0 15px 0',
                  color: isDarkTheme ? '#e2e8f0' : '#2d3748',
                  fontSize: '22px',
                  fontWeight: '600'
                }}>
                  Ilustração Vetorial
                </h3>
                <p style={{
                  margin: '0 0 15px 0',
                  color: isDarkTheme ? '#cbd5e0' : '#666',
                  fontSize: '14px',
                  lineHeight: '1.6'
                }}>
                  Criação de ilustrações vetoriais personalizadas com técnicas profissionais de design gráfico. Inclui logos, ícones, personagens e elementos visuais para branding.
                </p>
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  flexWrap: 'wrap',
                  marginBottom: '20px'
                }}>
                  {['Illustrator', 'Vector Art', 'Branding'].map((tech, index) => (
                    <span key={index} style={{
                      backgroundColor: isDarkTheme ? '#2d3748' : '#f1f5f9',
                      color: isDarkTheme ? '#e2e8f0' : '#475569',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {tech}
                    </span>
                  ))}
                </div>
                <div style={{
                  display: 'flex',
                  gap: '10px',
                  flexWrap: 'wrap'
                }}>
                  <a 
                    href="https://behance.net/usuario/ilustracoes" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      backgroundColor: isDarkTheme ? '#ff6b6b' : '#ff6b6b',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontSize: '13px',
                      fontWeight: '500',
                      transition: 'all 0.3s ease',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#e55656';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#ff6b6b';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    🖼️ Ver Trabalhos
                  </a>
                  <a 
                    href="https://instagram.com/usuario.design" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      backgroundColor: isDarkTheme ? '#4ecdc4' : '#4ecdc4',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontSize: '13px',
                      fontWeight: '500',
                      transition: 'all 0.3s ease',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#26d0ce';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#4ecdc4';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    📱 Instagram
                  </a>
                </div>
              </div>
            </div>

            {/* Projeto 5 - Web Development */}
            <div style={{
              backgroundColor: isDarkTheme ? '#1a202c' : 'white',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: isDarkTheme 
                ? '0 15px 35px rgba(0, 0, 0, 0.3)' 
                : '0 15px 35px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = isDarkTheme 
                ? '0 25px 50px rgba(0, 0, 0, 0.4)' 
                : '0 25px 50px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = isDarkTheme 
                ? '0 15px 35px rgba(0, 0, 0, 0.3)' 
                : '0 15px 35px rgba(0, 0, 0, 0.1)';
            }}>
              <div style={{
                height: '220px',
                backgroundImage: 'url(./images/html.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, rgba(56, 178, 172, 0.8) 0%, rgba(129, 230, 217, 0.8) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0,
                  transition: 'opacity 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '0';
                }}>
                  <span style={{
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: '600',
                    textAlign: 'center'
                  }}>Ver Projeto</span>
                </div>
              </div>
              <div style={{
                padding: '25px'
              }}>
                <h3 style={{
                  margin: '0 0 15px 0',
                  color: isDarkTheme ? '#e2e8f0' : '#2d3748',
                  fontSize: '22px',
                  fontWeight: '600'
                }}>
                  Website Responsivo
                </h3>
                <p style={{
                  margin: '0 0 15px 0',
                  color: isDarkTheme ? '#cbd5e0' : '#666',
                  fontSize: '14px',
                  lineHeight: '1.6'
                }}>
                  Desenvolvimento de website responsivo com HTML5, CSS3 e JavaScript moderno para múltiplas plataformas. Inclui animações, formulários interativos e otimização SEO.
                </p>
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  flexWrap: 'wrap',
                  marginBottom: '20px'
                }}>
                  {['HTML5', 'CSS3', 'JavaScript'].map((tech, index) => (
                    <span key={index} style={{
                      backgroundColor: isDarkTheme ? '#2d3748' : '#f1f5f9',
                      color: isDarkTheme ? '#e2e8f0' : '#475569',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {tech}
                    </span>
                  ))}
                </div>
                <div style={{
                  display: 'flex',
                  gap: '10px',
                  flexWrap: 'wrap'
                }}>
                  <a 
                    href="https://github.com/usuario/website-responsivo" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      backgroundColor: isDarkTheme ? '#38b2ac' : '#38b2ac',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontSize: '13px',
                      fontWeight: '500',
                      transition: 'all 0.3s ease',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#319795';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#38b2ac';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    💻 Ver Código
                  </a>
                  <a 
                    href="https://website-responsivo.netlify.app" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      backgroundColor: isDarkTheme ? '#81e6d9' : '#81e6d9',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontSize: '13px',
                      fontWeight: '500',
                      transition: 'all 0.3s ease',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#4fd1c7';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#81e6d9';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    🌐 Site Online
                  </a>
                </div>
              </div>
            </div>

            {/* Projeto 6 - Editorial Design */}
            <div style={{
              backgroundColor: isDarkTheme ? '#1a202c' : 'white',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: isDarkTheme 
                ? '0 15px 35px rgba(0, 0, 0, 0.3)' 
                : '0 15px 35px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = isDarkTheme 
                ? '0 25px 50px rgba(0, 0, 0, 0.4)' 
                : '0 25px 50px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = isDarkTheme 
                ? '0 15px 35px rgba(0, 0, 0, 0.3)' 
                : '0 15px 35px rgba(0, 0, 0, 0.1)';
            }}>
              <div style={{
                height: '220px',
                backgroundImage: 'url(./images/indesign.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, rgba(139, 69, 19, 0.8) 0%, rgba(160, 82, 45, 0.8) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0,
                  transition: 'opacity 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '0';
                }}>
                  <span style={{
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: '600',
                    textAlign: 'center'
                  }}>Ver Projeto</span>
                </div>
              </div>
              <div style={{
                padding: '25px'
              }}>
                <h3 style={{
                  margin: '0 0 15px 0',
                  color: isDarkTheme ? '#e2e8f0' : '#2d3748',
                  fontSize: '22px',
                  fontWeight: '600'
                }}>
                  Design Editorial
                </h3>
                <p style={{
                  margin: '0 0 15px 0',
                  color: isDarkTheme ? '#cbd5e0' : '#666',
                  fontSize: '14px',
                  lineHeight: '1.6'
                }}>
                  Criação de layouts editoriais profissionais para revistas, livros e materiais impressos usando InDesign. Inclui tipografia avançada, diagramação e preparação para impressão.
                </p>
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  flexWrap: 'wrap',
                  marginBottom: '20px'
                }}>
                  {['InDesign', 'Editorial', 'Typography'].map((tech, index) => (
                    <span key={index} style={{
                      backgroundColor: isDarkTheme ? '#2d3748' : '#f1f5f9',
                      color: isDarkTheme ? '#e2e8f0' : '#475569',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {tech}
                    </span>
                  ))}
                </div>
                <div style={{
                  display: 'flex',
                  gap: '10px',
                  flexWrap: 'wrap'
                }}>
                  <a 
                    href="https://issuu.com/usuario/editorial-design" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      backgroundColor: isDarkTheme ? '#8b4513' : '#8b4513',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontSize: '13px',
                      fontWeight: '500',
                      transition: 'all 0.3s ease',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#a0522d';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#8b4513';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    📖 Ver Publicações
                  </a>
                  <a 
                    href="https://behance.net/usuario/editorial" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      backgroundColor: isDarkTheme ? '#cd853f' : '#cd853f',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontSize: '13px',
                      fontWeight: '500',
                      transition: 'all 0.3s ease',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#daa520';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#cd853f';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    📚 Portfolio
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline de Experiências Profissionais */}
      <div style={{
        padding: '80px 20px',
        background: isDarkTheme 
          ? 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)' 
          : 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
        minHeight: '100vh'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '60px'
          }}>
            <h2 style={{
              fontSize: '48px',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              margin: '0 0 20px 0',
              textAlign: 'center'
            }}>
              Experiência Profissional
            </h2>
            <p style={{
              fontSize: '18px',
              color: isDarkTheme ? '#a0aec0' : '#718096',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              Minha jornada profissional e principais conquistas ao longo da carreira
            </p>
          </div>

          {/* Timeline Container */}
          <div style={{
            position: 'relative',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            {/* Linha vertical da timeline */}
            <div style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              bottom: 0,
              width: '4px',
              background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
              transform: 'translateX(-50%)',
              borderRadius: '2px'
            }}></div>

            {/* Experiência 1 - Atual */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',              marginBottom: '60px',
              position: 'relative',
              width: '100%'
            }}>
              {/* Conteúdo à esquerda */}
              <div style={{
                width: 'calc(50% - 30px)',
                textAlign: 'right',
                paddingRight: '30px'
              }}>
                <div style={{
                  backgroundColor: isDarkTheme ? '#1a202c' : 'white',
                  padding: '25px',
                  borderRadius: '15px',
                  boxShadow: isDarkTheme 
                    ? '0 10px 30px rgba(0, 0, 0, 0.3)' 
                    : '0 10px 30px rgba(0, 0, 0, 0.1)',
                  border: isDarkTheme ? '1px solid #2d3748' : '1px solid #e2e8f0',
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{
                    display: 'inline-block',
                    backgroundColor: '#48bb78',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    marginBottom: '15px'
                  }}>
                    2023 - Atual
                  </div>
                  <h3 style={{
                    fontSize: '22px',
                    fontWeight: '600',
                    color: isDarkTheme ? '#e2e8f0' : '#2d3748',
                    margin: '0 0 10px 0'
                  }}>
                    Desenvolvedor Full Stack
                  </h3>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: '500',
                    color: '#667eea',
                    margin: '0 0 15px 0'
                  }}>
                    Tech Solutions Inc.
                  </h4>
                  <p style={{
                    fontSize: '14px',
                    color: isDarkTheme ? '#cbd5e0' : '#666',
                    lineHeight: '1.6',
                    margin: '0 0 15px 0'
                  }}>
                    Desenvolvimento de aplicações web modernas utilizando React, Node.js e MongoDB. Responsável por arquitetura de sistemas e liderança técnica de projetos.
                  </p>
                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    flexWrap: 'wrap',
                    justifyContent: 'flex-end'
                  }}>
                    {['React', 'Node.js', 'MongoDB', 'AWS'].map((tech, index) => (
                      <span key={index} style={{
                        backgroundColor: isDarkTheme ? '#2d3748' : '#f1f5f9',
                        color: isDarkTheme ? '#e2e8f0' : '#475569',
                        padding: '4px 10px',
                        borderRadius: '10px',
                        fontSize: '11px',
                        fontWeight: '500'
                      }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Ponto central */}
              <div style={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '20px',
                height: '20px',
                backgroundColor: '#48bb78',
                borderRadius: '50%',
                border: '4px solid ' + (isDarkTheme ? '#1a202c' : 'white'),
                boxShadow: '0 0 0 4px #48bb78',
                zIndex: 2
              }}></div>


            </div>

            {/* Experiência 2 */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '60px',
              position: 'relative',
              width: '100%',
              flexDirection: 'row-reverse'
            }}>


              {/* Ponto central */}
              <div style={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '20px',
                height: '20px',
                backgroundColor: '#4299e1',
                borderRadius: '50%',
                border: '4px solid ' + (isDarkTheme ? '#1a202c' : 'white'),
                boxShadow: '0 0 0 4px #4299e1',
                zIndex: 2
              }}></div>

              {/* Conteúdo à direita */}
              <div style={{
                width: 'calc(50% - 30px)',
                paddingLeft: '30px'
              }}>
                <div style={{
                  backgroundColor: isDarkTheme ? '#1a202c' : 'white',
                  padding: '25px',
                  borderRadius: '15px',
                  boxShadow: isDarkTheme 
                    ? '0 10px 30px rgba(0, 0, 0, 0.3)' 
                    : '0 10px 30px rgba(0, 0, 0, 0.1)',
                  border: isDarkTheme ? '1px solid #2d3748' : '1px solid #e2e8f0',
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{
                    display: 'inline-block',
                    backgroundColor: '#4299e1',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    marginBottom: '15px'
                  }}>
                    2021 - 2023
                  </div>
                  <h3 style={{
                    fontSize: '22px',
                    fontWeight: '600',
                    color: isDarkTheme ? '#e2e8f0' : '#2d3748',
                    margin: '0 0 10px 0'
                  }}>
                    Desenvolvedor Frontend
                  </h3>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: '500',
                    color: '#667eea',
                    margin: '0 0 15px 0'
                  }}>
                    Digital Agency Pro
                  </h4>
                  <p style={{
                    fontSize: '14px',
                    color: isDarkTheme ? '#cbd5e0' : '#666',
                    lineHeight: '1.6',
                    margin: '0 0 15px 0'
                  }}>
                    Criação de interfaces responsivas e experiências de usuário excepcionais. Colaboração com equipes de design para implementar soluções inovadoras.
                  </p>
                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    flexWrap: 'wrap'
                  }}>
                    {['React', 'TypeScript', 'Sass', 'Figma'].map((tech, index) => (
                      <span key={index} style={{
                        backgroundColor: isDarkTheme ? '#2d3748' : '#f1f5f9',
                        color: isDarkTheme ? '#e2e8f0' : '#475569',
                        padding: '4px 10px',
                        borderRadius: '10px',
                        fontSize: '11px',
                        fontWeight: '500'
                      }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Experiência 3 */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '60px',
              position: 'relative',
              width: '100%'
            }}>
              {/* Conteúdo à esquerda */}
              <div style={{
                width: 'calc(50% - 30px)',
                textAlign: 'right',
                paddingRight: '30px'
              }}>
                <div style={{
                  backgroundColor: isDarkTheme ? '#1a202c' : 'white',
                  padding: '25px',
                  borderRadius: '15px',
                  boxShadow: isDarkTheme 
                    ? '0 10px 30px rgba(0, 0, 0, 0.3)' 
                    : '0 10px 30px rgba(0, 0, 0, 0.1)',
                  border: isDarkTheme ? '1px solid #2d3748' : '1px solid #e2e8f0',
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{
                    display: 'inline-block',
                    backgroundColor: '#ed8936',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    marginBottom: '15px'
                  }}>
                    2019 - 2021
                  </div>
                  <h3 style={{
                    fontSize: '22px',
                    fontWeight: '600',
                    color: isDarkTheme ? '#e2e8f0' : '#2d3748',
                    margin: '0 0 10px 0'
                  }}>
                    Designer UI/UX
                  </h3>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: '500',
                    color: '#667eea',
                    margin: '0 0 15px 0'
                  }}>
                    Creative Studio
                  </h4>
                  <p style={{
                    fontSize: '14px',
                    color: isDarkTheme ? '#cbd5e0' : '#666',
                    lineHeight: '1.6',
                    margin: '0 0 15px 0'
                  }}>
                    Design de interfaces e experiências digitais focadas no usuário. Prototipagem, testes de usabilidade e criação de sistemas de design.
                  </p>
                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    flexWrap: 'wrap',
                    justifyContent: 'flex-end'
                  }}>
                    {['Figma', 'Adobe XD', 'Sketch', 'Photoshop'].map((tech, index) => (
                      <span key={index} style={{
                        backgroundColor: isDarkTheme ? '#2d3748' : '#f1f5f9',
                        color: isDarkTheme ? '#e2e8f0' : '#475569',
                        padding: '4px 10px',
                        borderRadius: '10px',
                        fontSize: '11px',
                        fontWeight: '500'
                      }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Ponto central */}
              <div style={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '20px',
                height: '20px',
                backgroundColor: '#ed8936',
                borderRadius: '50%',
                border: '4px solid ' + (isDarkTheme ? '#1a202c' : 'white'),
                boxShadow: '0 0 0 4px #ed8936',
                zIndex: 2
              }}></div>


            </div>

            {/* Experiência 4 - Início */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '40px',
              position: 'relative'
            }}>
              {/* Espaço à esquerda */}
              <div style={{ width: '45%' }}></div>

              {/* Ponto central */}
              <div style={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '20px',
                height: '20px',
                backgroundColor: '#9f7aea',
                borderRadius: '50%',
                border: '4px solid ' + (isDarkTheme ? '#1a202c' : 'white'),
                boxShadow: '0 0 0 4px #9f7aea',
                zIndex: 2
              }}></div>

              {/* Conteúdo à direita */}
              <div style={{
                width: '45%',
                paddingLeft: '30px'
              }}>
                <div style={{
                  backgroundColor: isDarkTheme ? '#1a202c' : 'white',
                  padding: '25px',
                  borderRadius: '15px',
                  boxShadow: isDarkTheme 
                    ? '0 10px 30px rgba(0, 0, 0, 0.3)' 
                    : '0 10px 30px rgba(0, 0, 0, 0.1)',
                  border: isDarkTheme ? '1px solid #2d3748' : '1px solid #e2e8f0',
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{
                    display: 'inline-block',
                    backgroundColor: '#9f7aea',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    marginBottom: '15px'
                  }}>
                    2018 - 2019
                  </div>
                  <h3 style={{
                    fontSize: '22px',
                    fontWeight: '600',
                    color: isDarkTheme ? '#e2e8f0' : '#2d3748',
                    margin: '0 0 10px 0'
                  }}>
                    Estagiário em Desenvolvimento
                  </h3>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: '500',
                    color: '#667eea',
                    margin: '0 0 15px 0'
                  }}>
                    StartUp Tech
                  </h4>
                  <p style={{
                    fontSize: '14px',
                    color: isDarkTheme ? '#cbd5e0' : '#666',
                    lineHeight: '1.6',
                    margin: '0 0 15px 0'
                  }}>
                    Início da jornada profissional com foco em desenvolvimento web. Aprendizado de tecnologias fundamentais e participação em projetos reais.
                  </p>
                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    flexWrap: 'wrap'
                  }}>
                    {['HTML', 'CSS', 'JavaScript', 'Git'].map((tech, index) => (
                      <span key={index} style={{
                        backgroundColor: isDarkTheme ? '#2d3748' : '#f1f5f9',
                        color: isDarkTheme ? '#e2e8f0' : '#475569',
                        padding: '4px 10px',
                        borderRadius: '10px',
                        fontSize: '11px',
                        fontWeight: '500'
                      }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Formação Acadêmica */}
      <div style={{
        padding: '80px 20px',
        background: isDarkTheme 
          ? 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)' 
          : 'linear-gradient(135deg, #edf2f7 0%, #f7fafc 100%)',
        minHeight: '100vh'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '60px'
          }}>
            <h2 style={{
              fontSize: '48px',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              margin: '0 0 20px 0',
              textAlign: 'center'
            }}>
              Formação Acadêmica
            </h2>
            <p style={{
              fontSize: '18px',
              color: isDarkTheme ? '#a0aec0' : '#718096',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              Minha trajetória educacional e certificações que fundamentam minha expertise
            </p>
          </div>

          {/* Cards de Formação */}
          <div className="education-grid" style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: window.innerWidth <= 768 ? '20px' : '30px',
            maxWidth: '1000px',
            margin: '0 auto',
            padding: window.innerWidth <= 768 ? '0 10px' : '0'
          }}>
            {/* Graduação */}
            <div style={{
              backgroundColor: isDarkTheme ? '#1a202c' : 'white',
              padding: '30px',
              borderRadius: '20px',
              boxShadow: isDarkTheme 
                ? '0 15px 40px rgba(0, 0, 0, 0.4)' 
                : '0 15px 40px rgba(0, 0, 0, 0.1)',
              border: isDarkTheme ? '1px solid #2d3748' : '1px solid #e2e8f0',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Ícone de graduação */}
              <div style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '50%',
                opacity: '0.1',
                transform: 'rotate(15deg)'
              }}></div>
              
              <div style={{
                display: 'inline-block',
                backgroundColor: '#667eea',
                color: 'white',
                padding: '6px 15px',
                borderRadius: '25px',
                fontSize: '12px',
                fontWeight: '600',
                marginBottom: '20px'
              }}>
                2018 - 2022
              </div>
              
              <h3 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: isDarkTheme ? '#e2e8f0' : '#2d3748',
                margin: '0 0 10px 0',
                lineHeight: '1.3'
              }}>
                Bacharelado em Ciência da Computação
              </h3>
              
              <h4 style={{
                fontSize: '18px',
                fontWeight: '500',
                color: '#667eea',
                margin: '0 0 20px 0'
              }}>
                Universidade Federal de Tecnologia
              </h4>
              
              <p style={{
                fontSize: '15px',
                color: isDarkTheme ? '#cbd5e0' : '#666',
                lineHeight: '1.6',
                margin: '0 0 20px 0'
              }}>
                Formação sólida em algoritmos, estruturas de dados, engenharia de software e desenvolvimento de sistemas. Projeto final focado em aplicações web modernas.
              </p>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '15px'
              }}>
                <span style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: isDarkTheme ? '#a0aec0' : '#718096'
                }}>
                  CRA:
                </span>
                <span style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#48bb78'
                }}>
                  8.5/10
                </span>
              </div>
              
              <div style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap'
              }}>
                {['Algoritmos', 'Estruturas de Dados', 'Engenharia de Software', 'Banco de Dados'].map((subject, index) => (
                  <span key={index} style={{
                    backgroundColor: isDarkTheme ? '#2d3748' : '#f1f5f9',
                    color: isDarkTheme ? '#e2e8f0' : '#475569',
                    padding: '5px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {subject}
                  </span>
                ))}
              </div>
            </div>

            {/* Pós-graduação */}
            <div style={{
              backgroundColor: isDarkTheme ? '#1a202c' : 'white',
              padding: '30px',
              borderRadius: '20px',
              boxShadow: isDarkTheme 
                ? '0 15px 40px rgba(0, 0, 0, 0.4)' 
                : '0 15px 40px rgba(0, 0, 0, 0.1)',
              border: isDarkTheme ? '1px solid #2d3748' : '1px solid #e2e8f0',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Ícone de pós-graduação */}
              <div style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
                borderRadius: '50%',
                opacity: '0.1',
                transform: 'rotate(-15deg)'
              }}></div>
              
              <div style={{
                display: 'inline-block',
                backgroundColor: '#4299e1',
                color: 'white',
                padding: '6px 15px',
                borderRadius: '25px',
                fontSize: '12px',
                fontWeight: '600',
                marginBottom: '20px'
              }}>
                2023 - 2024
              </div>
              
              <h3 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: isDarkTheme ? '#e2e8f0' : '#2d3748',
                margin: '0 0 10px 0',
                lineHeight: '1.3'
              }}>
                Especialização em Desenvolvimento Full Stack
              </h3>
              
              <h4 style={{
                fontSize: '18px',
                fontWeight: '500',
                color: '#4299e1',
                margin: '0 0 20px 0'
              }}>
                Instituto de Tecnologia Avançada
              </h4>
              
              <p style={{
                fontSize: '15px',
                color: isDarkTheme ? '#cbd5e0' : '#666',
                lineHeight: '1.6',
                margin: '0 0 20px 0'
              }}>
                Especialização focada em tecnologias modernas de desenvolvimento web, arquitetura de microsserviços e metodologias ágeis.
              </p>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '15px'
              }}>
                <span style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: isDarkTheme ? '#a0aec0' : '#718096'
                }}>
                  Status:
                </span>
                <span style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#48bb78',
                  backgroundColor: isDarkTheme ? '#1a202c' : '#f0fff4',
                  padding: '3px 10px',
                  borderRadius: '10px',
                  border: '1px solid #48bb78'
                }}>
                  Concluído
                </span>
              </div>
              
              <div style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap'
              }}>
                {['React', 'Node.js', 'MongoDB', 'Docker', 'AWS'].map((tech, index) => (
                  <span key={index} style={{
                    backgroundColor: isDarkTheme ? '#2d3748' : '#f1f5f9',
                    color: isDarkTheme ? '#e2e8f0' : '#475569',
                    padding: '5px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Certificações */}
          <div style={{
            marginTop: '60px'
          }}>
            <h3 style={{
              fontSize: '32px',
              fontWeight: '600',
              color: isDarkTheme ? '#e2e8f0' : '#2d3748',
              textAlign: 'center',
              marginBottom: '40px'
            }}>
              Certificações
            </h3>
            
            <div className="certifications-grid" style={{
              display: 'grid',
              gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: window.innerWidth <= 768 ? '15px' : '20px',
              maxWidth: '900px',
              margin: '0 auto',
              padding: window.innerWidth <= 768 ? '0 10px' : '0'
            }}>
              {/* Certificação 1 */}
              <div style={{
                backgroundColor: isDarkTheme ? '#1a202c' : 'white',
                padding: '25px',
                borderRadius: '15px',
                boxShadow: isDarkTheme 
                  ? '0 10px 30px rgba(0, 0, 0, 0.3)' 
                  : '0 10px 30px rgba(0, 0, 0, 0.1)',
                border: isDarkTheme ? '1px solid #2d3748' : '1px solid #e2e8f0',
                transition: 'all 0.3s ease',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '50%',
                  margin: '0 auto 15px auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  color: 'white',
                  fontWeight: 'bold'
                }}>
                  AWS
                </div>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: isDarkTheme ? '#e2e8f0' : '#2d3748',
                  margin: '0 0 8px 0'
                }}>
                  AWS Certified Developer
                </h4>
                <p style={{
                  fontSize: '13px',
                  color: isDarkTheme ? '#a0aec0' : '#718096',
                  margin: '0 0 10px 0'
                }}>
                  Amazon Web Services
                </p>
                <span style={{
                  fontSize: '12px',
                  color: '#48bb78',
                  fontWeight: '500'
                }}>
                  2023
                </span>
              </div>

              {/* Certificação 2 */}
              <div style={{
                backgroundColor: isDarkTheme ? '#1a202c' : 'white',
                padding: '25px',
                borderRadius: '15px',
                boxShadow: isDarkTheme 
                  ? '0 10px 30px rgba(0, 0, 0, 0.3)' 
                  : '0 10px 30px rgba(0, 0, 0, 0.1)',
                border: isDarkTheme ? '1px solid #2d3748' : '1px solid #e2e8f0',
                transition: 'all 0.3s ease',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
                  borderRadius: '50%',
                  margin: '0 auto 15px auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  color: 'white',
                  fontWeight: 'bold'
                }}>
                  ⚛️
                </div>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: isDarkTheme ? '#e2e8f0' : '#2d3748',
                  margin: '0 0 8px 0'
                }}>
                  React Developer Certification
                </h4>
                <p style={{
                  fontSize: '13px',
                  color: isDarkTheme ? '#a0aec0' : '#718096',
                  margin: '0 0 10px 0'
                }}>
                  Meta (Facebook)
                </p>
                <span style={{
                  fontSize: '12px',
                  color: '#48bb78',
                  fontWeight: '500'
                }}>
                  2022
                </span>
              </div>

              {/* Certificação 3 */}
              <div style={{
                backgroundColor: isDarkTheme ? '#1a202c' : 'white',
                padding: '25px',
                borderRadius: '15px',
                boxShadow: isDarkTheme 
                  ? '0 10px 30px rgba(0, 0, 0, 0.3)' 
                  : '0 10px 30px rgba(0, 0, 0, 0.1)',
                border: isDarkTheme ? '1px solid #2d3748' : '1px solid #e2e8f0',
                transition: 'all 0.3s ease',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                  borderRadius: '50%',
                  margin: '0 auto 15px auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  color: 'white',
                  fontWeight: 'bold'
                }}>
                  🎨
                </div>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: isDarkTheme ? '#e2e8f0' : '#2d3748',
                  margin: '0 0 8px 0'
                }}>
                  UX/UI Design Professional
                </h4>
                <p style={{
                  fontSize: '13px',
                  color: isDarkTheme ? '#a0aec0' : '#718096',
                  margin: '0 0 10px 0'
                }}>
                  Google Design
                </p>
                <span style={{
                  fontSize: '12px',
                  color: '#48bb78',
                  fontWeight: '500'
                }}>
                  2021
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal de preview da foto de perfil */}
       {showProfilePreview && (
         <div 
           style={{
             position: 'fixed',
             top: 0,
             left: 0,
             width: '100%',
             height: '100%',
             backgroundColor: 'rgba(0, 0, 0, 0.8)',
             display: 'flex',
             alignItems: 'center',
             justifyContent: 'center',
             zIndex: 1000,
             animation: 'fadeIn 0.3s ease-out'
           }}
           onClick={closeProfilePreview}
         >
           <div 
             style={{
               position: 'relative',
               maxWidth: window.innerWidth <= 768 ? '95%' : '90%',
               maxHeight: window.innerWidth <= 768 ? '95%' : '90%',
               animation: 'scaleIn 0.3s ease-out'
             }}
             onClick={(e) => e.stopPropagation()}
           >
            <img 
              src={profileImage}
              alt="Foto do Perfil - Visualização"
              style={{
                maxWidth: '100%',
                maxHeight: window.innerWidth <= 768 ? '70vh' : '80vh',
                borderRadius: '8px',
                objectFit: 'contain',
                animation: 'zoomIn 0.4s ease-out 0.1s both',
                transition: 'transform 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            />
            <button 
              onClick={closeProfilePreview}
              style={{
                position: 'absolute',
                top: window.innerWidth <= 768 ? '5px' : '10px',
                right: window.innerWidth <= 768 ? '5px' : '10px',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: window.innerWidth <= 768 ? '35px' : '40px',
                height: window.innerWidth <= 768 ? '35px' : '40px',
                cursor: 'pointer',
                fontSize: window.innerWidth <= 768 ? '16px' : '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'rotateIn 0.5s ease-out 0.2s both',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
                e.target.style.transform = 'scale(1.1) rotate(90deg)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
                e.target.style.transform = 'scale(1) rotate(0deg)';
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;