import React from 'react';

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

  return (
    <div>
      {/* Capa do perfil */}
      <div 
        onMouseEnter={() => setIsHoveringCover(true)}
        onMouseLeave={() => setIsHoveringCover(false)}
        onMouseDown={handleMouseDown}
        style={{
          backgroundImage: `url(${coverImage})`,
          backgroundSize: 'cover',
          backgroundPosition: isManualAdjustMode ? `calc(${coverPosition.includes('%') ? coverPosition.split(' ')[0] : '50%'} + ${coverOffset.x}px) calc(${coverPosition.includes('%') ? coverPosition.split(' ')[1] || '50%' : '50%'} + ${coverOffset.y}px)` : coverPosition,
          height: '300px',
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
                fontWeight: 'bold'
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
                fontWeight: 'bold'
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
          top: '20px',
          right: '20px',
          zIndex: 1000,
          backgroundColor: isDarkTheme ? '#4a5568' : '#ffffff',
          color: isDarkTheme ? '#ffffff' : '#2d3748',
          border: 'none',
          borderRadius: '50px',
          padding: '12px 20px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
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

      {/* Conteúdo do perfil */}
      <div style={{
        padding: '60px 20px 20px',
        background: isDarkTheme 
          ? 'linear-gradient(135deg, #2d3748 0%, #4a5568 100%)' 
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh',
        display: 'flex',
        gap: '40px',
        alignItems: 'flex-start'
      }}>
        {/* Coluna esquerda - Informações do perfil */}
        <div style={{
          flex: '1',
          minWidth: '300px',
          backgroundColor: isDarkTheme ? '#1a202c' : 'white',
          color: isDarkTheme ? '#e2e8f0' : '#2d3748',
          borderRadius: '20px',
          padding: '30px',
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
                       verticalAlign: 'middle'
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
               maxWidth: '90%',
               maxHeight: '90%',
               animation: 'scaleIn 0.3s ease-out'
             }}
             onClick={(e) => e.stopPropagation()}
           >
            <img 
              src={profileImage}
              alt="Foto do Perfil - Visualização"
              style={{
                maxWidth: '100%',
                maxHeight: '80vh',
                borderRadius: '8px',
                objectFit: 'contain'
              }}
            />
            <button 
              onClick={closeProfilePreview}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                cursor: 'pointer',
                fontSize: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
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